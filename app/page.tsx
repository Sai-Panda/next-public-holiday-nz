"use client";

import { useEffect, useMemo, useState } from "react";

type Holiday = {
  name: string;
  date: string;
};

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

const holidaysMetadata: Holiday[] = [
  {
    name: "Matariki",
    date: "2026-07-10",
  },
  {
    name: "Labour Day",
    date: "2026-10-26",
  },
];

const countdownLabels: Array<keyof Omit<CountdownParts, "done">> = [
  "days",
  "hours",
  "minutes",
  "seconds",
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
  const supportingHolidays = holidays.slice(1);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#eff6ff_0,_#ffffff_42%,_#f8fafc_100%)] text-slate-950">
      <div className="absolute inset-y-0 left-0 hidden w-6 bg-sky-300/80 md:block" />
      <div className="absolute inset-y-0 right-0 hidden w-6 bg-sky-300/80 md:block" />
      <div className="absolute right-0 top-0 hidden h-full w-24 bg-[radial-gradient(circle,_rgba(148,163,184,0.7)_1.8px,transparent_1.8px)] bg-[length:32px_32px] opacity-50 xl:block" />

      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <header className="mx-auto max-w-4xl pt-6 text-center sm:pt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-600">
            New Zealand National Public Holidays
          </p>
          <h1 className="mt-4 text-balance text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            When is the next NZ National Public Holiday?
          </h1>
        </header>

        <section className="mx-auto mt-8 w-full max-w-5xl rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur sm:mt-12 sm:p-8 lg:p-12">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Next up
            </p>
            <h2 className="mt-3 text-balance text-5xl font-black tracking-tight text-blue-600 sm:text-7xl lg:text-8xl">
              {nextHoliday.name}
            </h2>
            <p className="mt-4 text-2xl text-slate-800 sm:text-3xl">
              On {formatHolidayDate(nextHoliday.date)}
            </p>
            <p className="mx-auto mt-6 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">
              All times are in NZDT
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-4 sm:gap-4">
            {countdownLabels.map((label) => (
              <div
                key={label}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-5 text-center shadow-sm sm:px-5 sm:py-6"
              >
                <div className="text-4xl font-black tracking-tight text-amber-500 sm:text-5xl">
                  {nextHolidayCountdownValues[countdownLabels.indexOf(label)]}
                </div>
                <div className="mt-2 text-sm font-medium uppercase tracking-[0.25em] text-slate-500">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {supportingHolidays.length > 0 ? (
          <section className="mx-auto mt-10 w-full max-w-5xl pb-8 sm:mt-14">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Upcoming NZ Public Holidays
              </h3>
              <p className="text-sm text-slate-500">
                More holidays coming up this year
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {supportingHolidays.map((holiday) => {
                const countdown = getCountdownParts(holiday.date, now);

                return (
                  <article
                    key={holiday.name}
                    className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.3)] backdrop-blur"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Upcoming
                    </p>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h4 className="text-3xl font-black tracking-tight text-blue-600">
                          {holiday.name}
                        </h4>
                        <p className="mt-2 text-lg text-slate-700">
                          {formatHolidayDate(holiday.date)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-amber-50 px-4 py-3 text-right">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                          Countdown
                        </p>
                        <p className="mt-1 font-mono text-2xl font-bold text-amber-600">
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
