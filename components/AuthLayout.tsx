import Link from "next/link";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden lg:block w-1/2 bg-[#201f1e]">
        <div className="absolute inset-0 bg-linear-to-br from-[#9e6915]/40 via-[#201f1e] to-black/90" />
        <div className="absolute inset-0 flex flex-col justify-between py-4 items-center">
          <Link href="/" className="no-underline">
            <h1 className="text-white text-4xl font-bold">
              Gist<span className="text-[#cc830e]">Me</span>
            </h1>
          </Link>
          <p className="text-white text-base opacity-80 max-w-xs text-center px-6">
            Real conversations, real people, just you and your people, anytime.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16 bg-white">
        <div className="w-full max-w-md flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Link href="/" className="no-underline lg:hidden">
              <h1 className="font-bold text-2xl text-[#201f1e]">
                Gist<span className="text-[#65430c]">Me</span>
              </h1>
            </Link>
            <h2 className="text-3xl font-bold text-[#201f1e]">{title}</h2>
            <p className="text-[#878785] text-sm">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
