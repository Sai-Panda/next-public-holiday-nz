"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { Holiday, CountdownParts } from "../types/holiday";
import {
  getTime,
  getUpcomingHolidayOccurrences,
} from "../util/holiday.util";
import { holidays } from "../types/holidays";
import bgImage from '../../public/mountains_sheep.jpg'
import { CalendarDaysIcon } from '@heroicons/react/24/solid'
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";

const countdownLegend = ["Days", "Hours", "Minutes", "Seconds"] as const;

const NzFlagBackground = () => (
  <div className="absolute inset-0 -z-10">
    <Image
      src="/nz_flag.svg"
      alt=""
      fill
      className="object-cover"
      priority
    />
    <div className="absolute inset-0 backdrop-blur-[5px]" />
    <div className="absolute inset-0 bg-blue-950/55" />
  </div>
);

const getCountdownParts = (date: string, now: number): CountdownParts => {
  const diff = Math.max(0, getTime(date) - now);

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

const formatHolidayName = (
  holiday: Holiday,
  size: "large" | "small" = "large",
) => {
  const icon = holiday.theme?.icon;

  if (icon) {
    const sizeClass =
      size === "large"
        ? "h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24"
        : "h-7 w-7 sm:h-8 sm:w-8";
    const wrapperClass =
      size === "large"
        ? "inline-flex max-w-full flex-col items-center gap-2 sm:flex-row sm:gap-3"
        : "inline-flex items-center gap-2 sm:gap-3";

    return (
      <span className={wrapperClass}>
        <span className={size === "large" ? "break-words" : undefined}>
          {holiday.name}
        </span>
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

  return holiday.name;
};

const formatCountdownValues = (parts: CountdownParts) => {
  if (parts.done) {
    return ["Today", "Today", "Today", "Today"];
  }

  const pad = (value: number) => String(value).padStart(2, "0");
  return [
    pad(parts.days),
    pad(parts.hours),
    pad(parts.minutes),
    pad(parts.seconds),
  ];
};

type HolidayCountdownPageProps = {
  simulatedNow?: number;
};

const getReadableDate = (dateString: string) => {
  const date: Date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const readableDate: string = date.toLocaleDateString("en-US", options);

  return readableDate.replace(/,(?=[^,]*$)/, "");
}

export default function HolidayCountdownPage({ simulatedNow }: HolidayCountdownPageProps = {}) {
  const [now, setNow] = useState(() => simulatedNow ?? Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      if (simulatedNow !== undefined) {
        setNow((prevNow) => prevNow + 1000);
      } else {
        setNow(Date.now());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [simulatedNow]);

  const upcomingHolidayOccurrences = getUpcomingHolidayOccurrences(holidays, now, 5);
  const nextHolidayOccurrence = upcomingHolidayOccurrences[0];
  const upcomingHolidays = upcomingHolidayOccurrences.slice(1, 5);

  if (!nextHolidayOccurrence) {
    return (
      <main className="relative min-h-screen overflow-hidden text-slate-950">
        <NzFlagBackground />
        <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-6 text-center sm:px-6 sm:py-10 lg:px-8">
          <p className="text-xl font-semibold text-white">
            No upcoming NZ public holidays are loaded yet.
          </p>
        </div>
      </main>
    );
  }

  const nextHoliday = nextHolidayOccurrence.holiday;
  const nextHolidayDate = nextHolidayOccurrence.date;
  const nextHolidayCountdown = getCountdownParts(nextHolidayDate, now);
  const nextHolidayCountdownValues = formatCountdownValues(nextHolidayCountdown);
  const nextHolidayInfoUrl = nextHoliday.infoUrl;

  return (
    <main className="relative min-h-screen text-slate-950 flex flex-col bg-slate-950">
      <div className="relative h-[60vh] w-full shrink-0">
        <Image
          src={bgImage}
          alt="Background Image"
          placeholder="blur"
          quality={80}
          fill
          className="object-cover z-0 h-full"
        />
        {/* Fades the image to slate-950 before the upcoming-holidays section begins, so the
            transition is smooth instead of a hard cut. Sits above the image but below the
            text/button layer (z-20) so it never dims or blocks the CTA. */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="p-4 absolute z-20 text-white font-bold inset-0 mt-5">
          <div className="text-xl w-6/7">
            Next NZ National Public Holiday
          </div>

          {/* Why is there a gap next to the M */}
          <div className="text-6xl my-3">{nextHoliday.name}</div>

          <div className="flex flex-row items-center">
            <CalendarDaysIcon className="size-7" />
            <div className="ml-2 font-normal">
              {getReadableDate(nextHolidayDate)}
            </div>
          </div>

          <div className="mt-2">
            Countdown
          </div>

          <div className="mt-3 flex items-center gap-2">
            {[
              { value: nextHolidayCountdownValues[0], label: "DAYS" },
              { value: nextHolidayCountdownValues[1], label: "HOURS" },
              { value: nextHolidayCountdownValues[2], label: "MINUTES" },
              { value: nextHolidayCountdownValues[3], label: "SECONDS" },
            ].map((unit, i) => (
              <Fragment key={unit.label}>
                {i > 0 && (
                  <span className="text-3xl font-bold text-white pb-5">:</span>
                )}
                <div className="flex flex-col items-center bg-black/40 rounded-md px-2 py-2">
                  {/* suppressHydrationWarning: countdown value intentionally differs between SSR and client */}
                  <span className="text-4xl font-bold text-white leading-none" suppressHydrationWarning>{unit.value}</span>
                  <span className="text-[0.6rem] font-semibold text-gray-300 mt-1 tracking-widest">{unit.label}</span>
                </div>
              </Fragment>
            ))}
          </div>

          <div>
            <button className="bg-blue-600 text-white mt-5 px-4 py-2 rounded flex">
              <a
                href={nextHoliday.infoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex"
              >
                Learn more about {nextHoliday.name} <ArrowTopRightOnSquareIcon className="size-5 ml-1" />
              </a>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 text-white font-bold bg-slate-950 grow">
        <div>
          Upcoming NZ National Public Holidays
        </div>

        <div className="outline-2 rounded mt-2">
          {
            upcomingHolidays.map((upcomingHoliday) => {
              const holidayData = upcomingHoliday.holiday;
              const EmojiIcon = (holidayData.emoji);
              const date = upcomingHoliday.date;
              const countdown = getCountdownParts(date, now);

              return (
                <div className="flex outline-1 p-2" key={holidayData.name} >
                  <div className="flex items-centers w-3/5">
                    {EmojiIcon && <EmojiIcon className="size-8" />}

                    <div className="ml-1.5">
                      <div className="text-sm font-bold">
                        {holidayData.name}
                      </div>
                      <div className="text-[0.65rem] font-normal">
                        {getReadableDate(date)}
                      </div>
                    </div>
                  </div>

                  <div className="ml-2 flex flex-col">
                    <div className="text-[0.6rem]">
                      Countdown
                    </div>

                    {/* suppressHydrationWarning: countdown value intentionally differs between SSR and client */}
                    <div className="text-xs" suppressHydrationWarning>
                      {(() => {
                        const [d, h, m, s] = formatCountdownValues(countdown);
                        return countdown.done
                          ? d
                          : `${d}d ${h}h ${m}m ${s}s`;
                      })()}
                    </div>
                  </div>
                </div>

              );
            })
          }
        </div>
      </div>
    </main>
  );
}
