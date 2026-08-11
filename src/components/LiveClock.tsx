"use client";

import { useEffect, useState } from "react";
import LiveClock from "@/components/LiveClock";
export default function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!now) {
    return (
      <div className="h-[52px] w-[150px] rounded-2xl border border-white/[0.07] bg-white/[0.035] backdrop-blur-xl" />
    );
  }

  const time = now.toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Karachi",
  });

  const date = now.toLocaleDateString("en-PK", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Karachi",
  });

  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-2.5 backdrop-blur-xl transition-all duration-300 hover:border-purple-400/20 hover:bg-white/[0.05]">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
      </span>

      <div className="min-w-0">
        <div className="whitespace-nowrap text-sm font-bold tracking-tight text-white">
          {time}
        </div>

        <div className="whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.12em] text-white/30">
          {date}
        </div>
      </div>
    </div>
  );
}