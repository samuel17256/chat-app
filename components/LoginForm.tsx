"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import PasswordInput from "@/components/PasswordInput";
import { useToast } from "@/components/useToast";

export default function LoginForm() {
  const router = useRouter();
  const { showToast, Toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast("Fill all inputs");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Login failed");
        return;
      }

      showToast("Login successful", true);
      setTimeout(() => router.push("/gist"), 500);
    } catch {
      showToast("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Log in to your account" subtitle="Welcome back! Please enter your details.">
      {Toast}
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
            placeholder="e.g. samuel_nan@example.com"
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
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#e0dfdd]" />
        <span className="text-xs text-[#878785]">Don&apos;t have an account?</span>
        <div className="flex-1 h-px bg-[#e0dfdd]" />
      </div>

      <Link
        href="/register"
        className="w-full py-2.5 border border-[#878785] rounded-lg text-[#232322] font-medium text-center hover:bg-[#cc830e] hover:text-white hover:border-[#cc830e] transition-colors duration-200"
      >
        Create Account
      </Link>
    </AuthLayout>
  );
}
