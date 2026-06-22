import { Holiday } from "../types/holiday";

export const holidays: Holiday[] = [
  {
    name: "Matariki",
    date: "2026-07-10",
    infoUrl: "https://www.matariki.com/about",
    theme: {
      backgroundClassName: "bg-[#020617]",
      backgroundStyle: {
        backgroundImage:
          "radial-gradient(circle at 50% 28%, rgba(59,130,246,0.22) 0%, rgba(30,64,175,0.16) 22%, rgba(2,6,23,0.94) 62%, rgba(2,6,23,1) 100%)",
      },
      overlays: (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_28%,rgba(255,255,255,0.95)_0,rgba(255,255,255,0.42)_5px,transparent_18px),radial-gradient(circle_at_72%_32%,rgba(255,255,255,0.85)_0,rgba(255,255,255,0.2)_4px,transparent_14px),radial-gradient(circle_at_80%_38%,rgba(255,255,255,0.7)_0,rgba(255,255,255,0.16)_3px,transparent_12px)] opacity-70" />
        </>
      ),
      emoji: "🌌",
    },
  },
  {
    name: "Labour Day",
    date: "2026-10-26",
    infoUrl: "https://nzhistory.govt.nz/page/labour-day-0",
    theme: {
      emoji: "🇳🇿",
    },
  },
  {
    name: "Christmas Day",
    date: "2026-12-25",
    infoUrl: "https://nzhistory.govt.nz/culture/kiwi-christmas",
    theme: {
      backgroundClassName: "bg-[#0f1a0f]",
      backgroundStyle: {
        backgroundImage:
          "radial-gradient(circle at 50% 20%, rgba(220,38,38,0.28) 0%, rgba(185,28,28,0.14) 25%, rgba(15,26,15,0.96) 65%, rgba(15,26,15,1) 100%)",
      },
      overlays: (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(220,38,38,0.18)_0%,transparent_50%),radial-gradient(circle_at_70%_10%,rgba(34,197,94,0.14)_0%,transparent_45%),radial-gradient(circle_at_50%_80%,rgba(220,38,38,0.1)_0%,transparent_50%)]" />
        </>
      ),
      titleClassName:
        "text-red-400 drop-shadow-[0_12px_30px_rgba(220,38,38,0.45)]",
      emoji: "🎅",
    },
  },
];
