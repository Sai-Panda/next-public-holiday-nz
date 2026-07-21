import { Holiday } from "../types/holiday";
import {
  SparklesIcon,
  SunIcon,
  ScaleIcon,
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
    // Scales rather than a generic globe: Waitangi Day marks the Treaty of
    // Waitangi, a partnership/agreement between Maori and the Crown.
    emoji: ScaleIcon,
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
  },
  {
    name: "Labour Day",
    dates: ["2026-10-26", "2027-10-25", "2028-10-23"],
    infoUrl: "https://nzhistory.govt.nz/page/labour-day-0",
    emoji: WrenchScrewdriverIcon,
    theme: {
      // Copper/amber: echoes the dirt-track and evening-light tones in the
      // hero photo, and pairs with the wrench icon (tools, trade).
      accentColor: "#f59e0b",
    },
  },
  {
    name: "Christmas Day",
    dates: ["2026-12-25", "2027-12-27", "2028-12-25"],
    infoUrl: "https://nzhistory.govt.nz/culture/kiwi-christmas",
    emoji: GiftIcon,
  },
  {
    name: "Boxing Day",
    dates: ["2026-12-28", "2027-12-28", "2028-12-26"],
    infoUrl: "https://www.timeanddate.com/holidays/new-zealand/boxing-day",
    emoji: ShoppingBagIcon,
  },
];
