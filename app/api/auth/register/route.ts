import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { setAuthCookie, signToken } from "@/lib/auth";
import { validateRegistration } from "@/lib/validation";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    const validation = validateRegistration(username, email, password);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    await connectDB();

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, password: hashedPassword });

    const token = signToken({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    });

    const response = NextResponse.json(
      { message: "Account created successfully", username: user.username },
      { status: 201 }
    );
    setAuthCookie(response, token);
    return response;
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
