import { Holiday } from "../types/holiday";
import {
  SparklesIcon,
  SunIcon,
  GlobeAsiaAustraliaIcon,
  BookOpenIcon,
  HeartIcon,
  ShieldCheckIcon,
  TrophyIcon,
  StarIcon,
  WrenchScrewdriverIcon,
  GiftIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";

export const holidays: Holiday[] = [
  {
    name: "New Year's Day",
    dates: ["2026-01-01", "2027-01-01", "2028-01-03"],
    emoji: SparklesIcon,
  },
  {
    name: "Day after New Year's Day",
    dates: ["2026-01-02", "2027-01-04", "2028-01-04"],
    emoji: SunIcon,
  },
  {
    name: "Waitangi Day",
    dates: ["2026-02-06", "2027-02-08", "2028-02-07"],
    infoUrl: "https://www.waitangi.org.nz/whats-on/waitangi-day",
    emoji: GlobeAsiaAustraliaIcon,
  },
  {
    name: "Good Friday",
    dates: ["2026-04-03", "2027-03-26", "2028-04-14"],
    infoUrl: "https://tumanako.pndiocese.org.nz/2021/03/why-would-we-call-it-good-friday/",
    emoji: BookOpenIcon,
  },
  {
    name: "Easter Monday",
    dates: ["2026-04-06", "2027-03-29", "2028-04-17"],
    infoUrl: "https://www.timeanddate.com/holidays/new-zealand/easter-monday",
    emoji: HeartIcon,
  },
  {
    name: "ANZAC Day",
    dates: ["2026-04-27", "2027-04-26", "2028-04-25"],
    infoUrl: "https://nzhistory.govt.nz/war/anzac-day/introduction",
    emoji: ShieldCheckIcon,
  },
  {
    name: "King's Birthday",
    dates: ["2026-06-01", "2027-06-07", "2028-06-05"],
    infoUrl: "https://my.christchurchcitylibraries.com/kings-birthday/",
    emoji: TrophyIcon,
  },
  {
    name: "Matariki",
    dates: ["2026-07-10", "2027-06-25", "2028-07-14"],
    infoUrl: "https://www.matariki.com/about",
    emoji: StarIcon,
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
    },
  },
  {
    name: "Labour Day",
    dates: ["2026-10-26", "2027-10-25", "2028-10-23"],
    infoUrl: "https://nzhistory.govt.nz/page/labour-day-0",
    emoji: WrenchScrewdriverIcon,
  },
  {
    name: "Christmas Day",
    dates: ["2026-12-25", "2027-12-27", "2028-12-25"],
    infoUrl: "https://nzhistory.govt.nz/culture/kiwi-christmas",
    emoji: GiftIcon,
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
    },
  },
  {
    name: "Boxing Day",
    dates: ["2026-12-28", "2027-12-28", "2028-12-26"],
    infoUrl: "https://www.timeanddate.com/holidays/new-zealand/boxing-day",
    emoji: ShoppingBagIcon,
  },
];
