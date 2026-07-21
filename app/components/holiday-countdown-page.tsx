"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { CountdownParts } from "../types/holiday";
import {
  getTime,
  getUpcomingHolidayOccurrences,
  HolidayOccurrence,
} from "../util/holiday.util";
import { holidays } from "../types/holidays";
import bgImage from '../../public/mountains_sheep.jpg'
import {
  CalendarDaysIcon,
  ArrowTopRightOnSquareIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const UPCOMING_LIST_LIMIT = 4;
const UPCOMING_OVERLAY_LIMIT = 10;

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

  // Pinned to Pacific/Auckland: these are NZ holiday dates, so they must read
  // correctly regardless of the viewer's own timezone (otherwise a visitor
  // west of NZ, e.g. in the Americas, sees the date rolled back by a day).
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Pacific/Auckland',
  };

  const readableDate: string = date.toLocaleDateString("en-US", options);

  return readableDate.replace(/,(?=[^,]*$)/, "");
}

export default function HolidayCountdownPage({ simulatedNow }: HolidayCountdownPageProps = {}) {
  const [now, setNow] = useState(() => simulatedNow ?? Date.now());
  const [showAllHolidays, setShowAllHolidays] = useState(false);

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

  // Lock background scroll and let Escape close the overlay while it's open.
  useEffect(() => {
    if (!showAllHolidays) {
      return;
    }

    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowAllHolidays(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showAllHolidays]);

  const upcomingHolidayOccurrences = getUpcomingHolidayOccurrences(
    holidays,
    now,
    UPCOMING_OVERLAY_LIMIT + 1,
  );
  const nextHolidayOccurrence = upcomingHolidayOccurrences[0];
  const upcomingHolidays = upcomingHolidayOccurrences.slice(1, UPCOMING_LIST_LIMIT + 1);
  const allUpcomingHolidays = upcomingHolidayOccurrences.slice(1);

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

  const renderHolidayRow = (upcomingHoliday: HolidayOccurrence) => {
    const holidayData = upcomingHoliday.holiday;
    const EmojiIcon = holidayData.emoji;
    const date = upcomingHoliday.date;
    const countdown = getCountdownParts(date, now);
    // Only holidays with a theme (currently just Labour Day) get an
    // accent glow; everything else stays in the plain glass style
    // so it doesn't compete with the "next holiday" hero above.
    const accent = holidayData.theme?.accentColor;

    return (
      <div
        className="flex items-center justify-between gap-3 rounded-2xl border p-3.5 transition-transform duration-150 lg:hover:-translate-y-0.5"
        key={`${holidayData.name}-${date}`}
        style={
          accent
            ? {
                background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 18%, transparent), color-mix(in srgb, ${accent} 3%, transparent))`,
                borderColor: `color-mix(in srgb, ${accent} 40%, transparent)`,
                boxShadow: `0 0 34px -8px color-mix(in srgb, ${accent} 45%, transparent)`,
              }
            : {
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.015))",
                borderColor: "rgba(255,255,255,0.08)",
              }
        }
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full"
            style={
              accent
                ? {
                    background: `radial-gradient(circle at 35% 30%, color-mix(in srgb, ${accent} 65%, white), color-mix(in srgb, ${accent} 55%, black) 70%)`,
                    color: `color-mix(in srgb, ${accent} 20%, white)`,
                  }
                : { background: "rgba(255,255,255,0.07)", color: "#e2e8f0" }
            }
          >
            {EmojiIcon && <EmojiIcon className="size-5" />}
          </div>

          <div className="min-w-0">
            <div
              className="truncate text-sm font-bold text-white"
              style={accent ? { color: `color-mix(in srgb, ${accent} 35%, white)` } : undefined}
            >
              {holidayData.name}
            </div>
            <div className="text-[0.68rem] font-normal text-gray-400">
              {getReadableDate(date)}
            </div>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div
            className="text-[0.55rem] font-bold tracking-widest"
            style={{ color: accent ? `color-mix(in srgb, ${accent} 70%, white)` : "#7c8494" }}
          >
            IN
          </div>

          {/* suppressHydrationWarning: countdown value intentionally differs between SSR and client */}
          <div
            className="text-xs font-semibold"
            style={{ color: accent ? `color-mix(in srgb, ${accent} 35%, white)` : "#e5e7eb" }}
            suppressHydrationWarning
          >
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
  };

  return (
    <main className="relative min-h-screen text-slate-950 flex flex-col bg-slate-950">
      <div className="relative min-h-[60vh] w-full shrink-0 lg:flex lg:min-h-[75vh] lg:items-center">
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
            text/button layer (z-20) so it never dims or blocks the CTA. Fixed height (not a
            % of the hero) since the hero's height is content-driven and may grow at zoom. */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none lg:h-40" />
        {/* Relative (not absolute/inset-0) so this content is in normal flow and drives the
            hero's height — if zoomed text needs more than min-h-[60vh], the hero grows and
            pushes the section below down instead of the text overlapping it. */}
        <div className="p-4 relative z-20 text-white font-bold mt-5 lg:mx-auto lg:mt-8 lg:w-full lg:max-w-4xl lg:px-16 lg:text-center">
          <div className="text-xl w-6/7 lg:w-auto lg:text-2xl">
            Next NZ National Public Holiday
          </div>

          <div className="text-6xl my-3 lg:text-8xl lg:my-4">{nextHoliday.name}</div>

          <div className="flex flex-row items-center lg:justify-center">
            <CalendarDaysIcon className="size-7 lg:size-8" />
            <div className="ml-2 font-normal lg:text-lg">
              {getReadableDate(nextHolidayDate)}
            </div>
          </div>

          <div className="mt-2 lg:mt-6 lg:text-lg">
            Countdown
          </div>

          <div className="mt-3 flex items-center gap-2 lg:justify-center lg:gap-3">
            {[
              { value: nextHolidayCountdownValues[0], label: "DAYS" },
              { value: nextHolidayCountdownValues[1], label: "HOURS" },
              { value: nextHolidayCountdownValues[2], label: "MINUTES" },
              { value: nextHolidayCountdownValues[3], label: "SECONDS" },
            ].map((unit, i) => (
              <Fragment key={unit.label}>
                {i > 0 && (
                  <span className="text-3xl font-bold text-white pb-5 lg:text-4xl lg:pb-6">:</span>
                )}
                <div className="flex flex-col items-center bg-black/40 rounded-md px-2 py-2 lg:px-4 lg:py-4">
                  {/* suppressHydrationWarning: countdown value intentionally differs between SSR and client */}
                  <span className="text-4xl font-bold text-white leading-none lg:text-6xl" suppressHydrationWarning>{unit.value}</span>
                  <span className="text-[0.6rem] font-semibold text-gray-300 mt-1 tracking-widest lg:mt-2 lg:text-xs">{unit.label}</span>
                </div>
              </Fragment>
            ))}
          </div>

          {nextHoliday.infoUrl ? (
            <div>
              <a
                href={nextHoliday.infoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/70 text-white mt-5 px-4 py-2 rounded-md flex items-center w-fit transition-colors hover:bg-black/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 lg:mx-auto lg:mt-8 lg:px-6 lg:py-3 lg:text-lg"
              >
                Learn more about {nextHoliday.name} <ArrowTopRightOnSquareIcon className="size-5 ml-1 lg:size-6" />
              </a>
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-4 text-white font-bold bg-slate-950 grow lg:px-16 lg:py-10">
        <div className="lg:mx-auto lg:max-w-2xl">
          <div className="lg:text-xl">
            Upcoming NZ National Public Holidays
          </div>

          <div className="mt-3 flex flex-col gap-2.5 lg:gap-3">
            {upcomingHolidays.map(renderHolidayRow)}
          </div>

          {allUpcomingHolidays.length > upcomingHolidays.length && (
            <button
              type="button"
              onClick={() => setShowAllHolidays(true)}
              className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs font-bold tracking-wide text-gray-300 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white active:bg-white/10 lg:mt-4 lg:p-4 lg:text-sm"
            >
              Show next {allUpcomingHolidays.length} holidays
              <ChevronRightIcon className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {showAllHolidays && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={`Next ${allUpcomingHolidays.length} public holidays`}
        >
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowAllHolidays(false)}
          />

          <div className="relative z-10 flex max-h-[85vh] w-full flex-col rounded-t-3xl border-t border-white/10 bg-slate-950 sm:max-w-md sm:rounded-3xl sm:border lg:max-w-xl">
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 p-4 lg:px-6 lg:py-5">
              <div className="text-sm font-bold text-white lg:text-base">
                Next {allUpcomingHolidays.length} Public Holidays
              </div>
              <button
                type="button"
                onClick={() => setShowAllHolidays(false)}
                aria-label="Close"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40 active:bg-white/15"
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 overflow-y-auto p-4 lg:gap-3 lg:p-6">
              {allUpcomingHolidays.map(renderHolidayRow)}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
