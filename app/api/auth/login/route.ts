import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { setAuthCookie, signToken } from "@/lib/auth";
import { validateLogin } from "@/lib/validation";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    const validation = validateLogin(email, password);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = signToken({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    });

    const response = NextResponse.json(
      { message: "Login successful", username: user.username },
      { status: 200 }
    );
    setAuthCookie(response, token);
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
