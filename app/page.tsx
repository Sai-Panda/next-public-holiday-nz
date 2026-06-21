"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Holiday = {
  name: string;
  date: string;
  infoUrl?: string;
  theme?: HolidayTheme;
};

type HolidayTheme = {
  backgroundClassName: string;
  backgroundStyle?: React.CSSProperties;
  overlays?: React.ReactNode;
  emoji?: string;
  icon?: {
    src: string;
    alt: string;
  };
};

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

const countdownLegend = ["Days", "Hours", "Minutes", "Seconds"] as const;

const defaultTheme: HolidayTheme = {
  backgroundClassName:
    "bg-[radial-gradient(circle_at_top,_#1d4ed8_0,_#1e3a8a_40%,_#172554_100%)]",
};

const holidaysMetadata: Holiday[] = [
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
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.9)_1px,transparent_1.5px)] bg-[length:42px_42px] opacity-15" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_28%,rgba(255,255,255,0.95)_0,rgba(255,255,255,0.42)_5px,transparent_18px),radial-gradient(circle_at_72%_32%,rgba(255,255,255,0.85)_0,rgba(255,255,255,0.2)_4px,transparent_14px),radial-gradient(circle_at_80%_38%,rgba(255,255,255,0.7)_0,rgba(255,255,255,0.16)_3px,transparent_12px)] opacity-70" />
        </>
      ),
      emoji: "🌌",
    },
  },
  {
    name: "Labour Day",
    date: "2026-10-26",
  },
];

const getTargetTime = (date: string) => new Date(date).getTime();

const getCountdownParts = (date: string, now: number): CountdownParts => {
  const diff = Math.max(0, getTargetTime(date) - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff === 0,
  };
};

const formatHolidayDate = (date: string) =>
  new Intl.DateTimeFormat("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Pacific/Auckland",
  }).format(new Date(date));

const formatHolidayName = (holiday: Holiday, size: "large" | "small" = "large") => {
  const icon = holiday.theme?.icon;
  const emoji = holiday.theme?.emoji;
  
  if (icon) {
    const sizeClass = size === "large" 
      ? "h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24" 
      : "h-7 w-7 sm:h-8 sm:w-8";
    
    return (
      <span className="inline-flex items-center gap-2 sm:gap-3">
        {holiday.name}{" "}
        <Image
          src={icon.src}
          alt={icon.alt}
          width={128}
          height={128}
          className={sizeClass}
        />
      </span>
    );
  }
  
  return emoji ? `${holiday.name} ${emoji}` : holiday.name;
};

const formatCountdownValues = (parts: CountdownParts) => {
  if (parts.done) {
    return ["Today", "Today", "Today", "Today"];
  }

  const pad = (value: number) => String(value).padStart(2, "0");
  return [
    String(parts.days),
    pad(parts.hours),
    pad(parts.minutes),
    pad(parts.seconds),
  ];
};

export default function Home() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const holidays = useMemo(
    () => [...holidaysMetadata].sort((a, b) => a.date.localeCompare(b.date)),
    [],
  );

  const nextHoliday = holidays[0];
  const nextHolidayCountdown = getCountdownParts(nextHoliday.date, now);
  const nextHolidayCountdownValues = formatCountdownValues(nextHolidayCountdown);
  const nextHolidayInfoUrl = nextHoliday.infoUrl;
  const theme = nextHoliday.theme || defaultTheme;
  const supportingHolidays = holidays.slice(1);

  return (
    <main
      className={`relative min-h-screen overflow-hidden text-slate-950 ${theme.backgroundClassName}`}
      style={theme.backgroundStyle}
    >
      {theme.overlays}
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <header className="mx-auto max-w-5xl pt-6 text-center sm:pt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-200/90">
            New Zealand National Public Holidays
          </p>
          <h1 className="mx-auto mt-4 max-w-[22ch] text-4xl font-black tracking-tight text-white sm:max-w-[40rem] sm:text-5xl lg:max-w-[49rem] lg:text-6xl">
            When is the next NZ National Public Holiday?
          </h1>
        </header>

        <div className="mx-auto mt-8 w-full max-w-5xl px-2 sm:mt-12 sm:px-6 lg:px-12">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-100/70 sm:text-base">
              Next up
            </p>
            <h2 className="mt-3 text-balance text-6xl font-black tracking-tight text-cyan-300 drop-shadow-[0_12px_30px_rgba(34,211,238,0.35)] sm:text-8xl lg:text-[8.5rem]">
              {formatHolidayName(nextHoliday)}
            </h2>
            <p className="mt-4 text-3xl text-sky-100/90 sm:text-4xl">
              On {formatHolidayDate(nextHoliday.date)}
            </p>
            {nextHolidayInfoUrl ? (
              <a
                className="mx-auto mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-white/80"
                href={nextHolidayInfoUrl}
                rel="noreferrer"
                target="_blank"
              >
                Learn more about {nextHoliday.name}
              </a>
            ) : null}
          </div>

          <div
            className="mx-auto mt-8 grid justify-center gap-x-2 text-center sm:gap-x-4"
            style={{ gridTemplateColumns: "repeat(7, max-content)" }}
          >
            {nextHolidayCountdownValues.map((value, index) => (
              <Fragment key={countdownLegend[index]}>
                <p
                  className="font-mono text-4xl font-bold leading-none tracking-[0.12em] text-white tabular-nums drop-shadow-[0_8px_25px_rgba(255,255,255,0.12)] sm:text-6xl"
                  style={{ gridColumn: index * 2 + 1, gridRow: 1 }}
                >
                  <span className="inline-block min-w-[2ch] text-center">{value}</span>
                </p>
                {index < nextHolidayCountdownValues.length - 1 ? (
                  <p
                    className="self-center font-mono text-4xl font-bold leading-none text-sky-100/60 sm:text-6xl"
                    style={{ gridColumn: index * 2 + 2, gridRow: 1 }}
                  >
                    :
                  </p>
                ) : null}
                <p
                  className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-sky-100/70 sm:text-xs sm:tracking-[0.35em]"
                  style={{ gridColumn: index * 2 + 1, gridRow: 2 }}
                >
                  {countdownLegend[index]}
                </p>
              </Fragment>
            ))}
          </div>
        </div>

        {supportingHolidays.length > 0 ? (
          <section className="mx-auto mt-10 w-full max-w-5xl pb-8 sm:mt-14">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Upcoming NZ Public Holidays
              </h3>
              <p className="text-sm text-sky-100/70">
                More holidays coming up this year
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {supportingHolidays.map((holiday) => {
                const countdown = getCountdownParts(holiday.date, now);

                return (
                  <article
                    key={holiday.name}
                    className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)] backdrop-blur"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">
                      Upcoming
                    </p>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h4 className="text-3xl font-black tracking-tight text-blue-700">
                          {formatHolidayName(holiday, "small")}
                        </h4>
                        <p className="mt-2 text-lg text-slate-900">
                          {formatHolidayDate(holiday.date)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-100 px-4 py-3 text-right ring-1 ring-inset ring-slate-200">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black">
                          Countdown
                        </p>
                        <p className="mt-1 font-mono text-2xl font-bold text-black">
                          {formatCountdownValues(countdown).join(":")}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
