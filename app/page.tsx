import Link from "next/link";
import Navbar from "@/components/Navbar";

const features = [
  {
    icon: "💬",
    title: "Real-time Messaging",
    description: "Send and receive messages instantly with no delays. Stay in sync with the people that matter.",
  },
  {
    icon: "🔒",
    title: "Private & Secure",
    description: "Your conversations stay yours. JWT auth and hashed passwords keep your account protected.",
  },
  {
    icon: "⚡",
    title: "Lightning Fast",
    description: "A lightweight interface that loads in seconds and works smoothly on any device.",
  },
  {
    icon: "👤",
    title: "Multiple Accounts",
    description: "Support for multiple users. Each person keeps their own identity in the chat room.",
  },
  {
    icon: "📱",
    title: "Mobile Friendly",
    description: "Fully responsive design that feels native on phones, tablets, and desktops alike.",
  },
  {
    icon: "🎨",
    title: "Clean Interface",
    description: "Minimal, distraction-free design so you can focus on what matters — the conversation.",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="pt-24 md:pt-28 pb-16 px-6">
          <div className="max-w-6xl mx-auto min-h-[85vh] flex flex-col-reverse md:flex-row items-center justify-between gap-12">
            <div className="flex flex-col gap-6 max-w-lg text-center md:text-left">
              <div className="flex flex-col gap-3">
                <span className="text-xs tracking-widest uppercase text-[#9e6915] font-medium">
                  Real conversations. Real people.
                </span>
                <h1 className="font-serif-custom text-5xl md:text-6xl lg:text-7xl leading-tight italic">
                  <span className="text-[#9e6915] not-italic font-bold font-mono-custom">Gist</span> without limits.
                </h1>
                <p className="text-[#5a5955] text-sm md:text-base leading-relaxed">
                  Just you and your people — anytime, anywhere. No noise, no distractions, just the gist.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link
                  href="/register"
                  className="px-6 py-3 bg-[#9e6915] rounded-lg text-white text-sm hover:bg-[#cc830e] transition-colors duration-200 text-center"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-3 border border-[#c8c6c0] rounded-lg text-sm hover:border-[#9e6915] hover:text-[#9e6915] transition-all duration-200 text-center"
                >
                  Sign In
                </Link>
              </div>

              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="flex -space-x-2">
                  {["A", "K", "M", "+"].map((letter, i) => (
                    <div
                      key={letter}
                      className={`w-7 h-7 rounded-full text-[10px] flex items-center justify-center border-2 border-white ${
                        i === 3 ? "bg-[#f5e9d3] text-[#7a500f]" : "bg-[#9e6915] text-white"
                      }`}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-[#9a9590]">Join thousands already gisting</span>
              </div>
            </div>

            <div className="relative shrink-0 flex items-center justify-center">
              <div className="absolute -bottom-4 -right-4 w-64 h-64 md:w-80 md:h-80 bg-[#9e6915] rounded-full opacity-10 z-0" />
              <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-[#9e6915] rounded-full opacity-20 z-0" />

              <div className="w-64 h-72 md:w-96 md:h-112 bg-linear-to-br from-[#f5e9d3] to-[#9e6915]/30 rounded-2xl relative z-10 shadow-xl flex items-center justify-center">
                <span className="text-6xl">💬</span>
              </div>

              <div className="absolute top-6 -left-6 md:-left-12 bg-white rounded-2xl rounded-tl-sm shadow-lg px-4 py-2.5 z-20 max-w-40">
                <p className="text-[10px] text-[#5a5955]">hey! you online? 👋</p>
                <span className="text-[9px] text-[#c8c6c0]">just now</span>
              </div>
              <div className="absolute bottom-10 -right-4 md:-right-10 bg-[#9e6915] rounded-2xl rounded-br-sm shadow-lg px-4 py-2.5 z-20 max-w-35">
                <p className="text-[10px] text-white">yeah, let&apos;s gist! 🔥</p>
                <span className="text-[9px] text-white/60">just now</span>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why choose <span className="text-[#9e6915]">GistMe?</span>
              </h2>
              <p className="text-[#5a5955] text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                More than just a chat app, a platform designed to foster genuine connections and meaningful
                conversations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="feature-card bg-[#faf9f7] border border-[#e8e3da] rounded-2xl p-6 flex flex-col gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#f5e9d3] flex items-center justify-center text-[#9e6915] text-lg">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-base">{feature.title}</h3>
                  <p className="text-[#5a5955] text-xs leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-[#9e6915] rounded-3xl px-8 py-12 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">Ready to start gisting?</h2>
                <p className="text-white/70 text-sm">Create a free account and connect with your people today.</p>
              </div>
              <Link
                href="/register"
                className="shrink-0 px-8 py-3 bg-white text-[#9e6915] font-bold text-sm rounded-xl hover:bg-[#f5e9d3] transition-colors duration-200"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-[#e8e3da] py-8 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="font-bold text-xl text-[#201f1e]">
                Gist<span className="text-[#9e6915]">Me</span>
              </h2>
              <p className="text-[#9a9590] text-xs mt-1">Real conversations. Real people.</p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <h3 className="font-bold text-sm">Follow Us</h3>
              <div className="flex gap-4">
                {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((social) => (
                  <a key={social} href="#" className="text-xs text-[#5a5955] hover:text-[#9e6915] transition-colors">
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-[#e8e3da] mt-6 pt-6 text-center">
            <p className="text-xs text-[#9a9590]">&copy; 2026 GistMe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
