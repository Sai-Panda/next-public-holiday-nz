"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { Holiday, CountdownParts } from "../types/holiday";
import {
  getTime,
  getUpcomingHolidayOccurrences,
} from "../util/holiday.util";
import { holidays } from "../types/holidays";
import bgImage from '../../public/harbourbridge.jpg'
import { CalendarDaysIcon } from '@heroicons/react/24/solid'


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
    String(parts.days),
    pad(parts.hours),
    pad(parts.minutes),
    pad(parts.seconds),
  ];
};

type HolidayCountdownPageProps = {
  simulatedNow?: number;
};

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
    <main className="relative h-screen overflow-hidden text-slate-950 font-bold">
      <div className="relative h-3/5 w-full">
        <Image
          src={bgImage}
          alt="Background Image"
          placeholder="blur"
          quality={80}
          fill
          className="object-cover z-10"
        />
        <div className="p-4 relative z-10 text-white top-1/10">
          <div className="text-xl w-6/7"> 
            Next NZ National Public Holiday
          </div>

          <div className="text-5xl my-3"> 
            {nextHoliday.name}
          </div>

          <div className="flex flex-row items-center">
            <CalendarDaysIcon className="size-7"/> 
            <div className="ml-2">
              {nextHolidayDate}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
