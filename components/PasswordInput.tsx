"use client";

import { useState } from "react";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PasswordInput({ id, value, onChange, placeholder }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex justify-between items-center border border-[#878785] rounded-lg px-4 py-2 focus-within:border-[#9e6915] focus-within:ring-1 focus-within:ring-[#9e6915] transition-all duration-200">
      <input
        type={visible ? "text" : "password"}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        placeholder={placeholder}
        className="border-0 rounded-lg text-sm outline-none w-full placeholder:text-[#b0afad]"
      />
      <button
        type="button"
        className="text-sm text-[#9e6915] hover:text-[#cc830e] transition-colors duration-200 border-0 shrink-0 ml-2"
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
