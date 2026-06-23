"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import PasswordInput from "@/components/PasswordInput";
import { useToast } from "@/components/useToast";
import { isValidPassword } from "@/lib/validation";

export default function RegisterForm() {
  const router = useRouter();
  const { showToast, Toast } = useToast();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password) {
      showToast("Fill all inputs");
      return;
    }
    if (username.trim().length < 6) {
      showToast("Username must be at least 6 characters");
      return;
    }
    if (!email.includes("@") || !email.includes(".") || email.includes(" ")) {
      showToast("Email must be valid");
      return;
    }
    if (!isValidPassword(password)) {
      showToast("Password must contain uppercase, lowercase, number and special character (@#$%&)");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Registration failed");
        return;
      }

      showToast("Account created successfully!", true);
      setUsername("");
      setEmail("");
      setPassword("");
      setTimeout(() => router.push("/gist"), 1200);
    } catch {
      showToast("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join GistMe and start gisting today.">
      {Toast}
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="username" className="text-sm text-[#232322] font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="e.g. samuel_nan"
            className="border border-[#878785] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#9e6915] focus:ring-1 focus:ring-[#9e6915] transition-all duration-200 placeholder:text-[#b0afad]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm text-[#232322] font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="border border-[#878785] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#9e6915] focus:ring-1 focus:ring-[#9e6915] transition-all duration-200 placeholder:text-[#b0afad]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm text-[#232322] font-medium">
            Password
          </label>
          <PasswordInput id="password" value={password} onChange={setPassword} placeholder="Min. 8 characters" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#9e6915] rounded-lg text-white font-medium cursor-pointer hover:bg-[#cc830e] transition-colors duration-200 mt-2 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#e0dfdd]" />
        <span className="text-xs text-[#878785]">already have an account?</span>
        <div className="flex-1 h-px bg-[#e0dfdd]" />
      </div>

      <Link
        href="/login"
        className="w-full py-2.5 border border-[#878785] rounded-lg text-[#232322] font-medium text-center hover:bg-[#cc830e] hover:text-white hover:border-[#cc830e] transition-colors duration-200"
      >
        Log In
      </Link>
    </AuthLayout>
  );
}
