"use client";

import { Fragment, useEffect, useState } from "react";
import {
  ArrowTopRightOnSquareIcon,
  BriefcaseIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { holidays } from "../types/holidays";
import {
  formatCountdownValues,
  getCountdownParts,
  getUpcomingHolidayOccurrences,
  HolidayOccurrence,
} from "../util/holiday.util";
import styles from "./holiday-countdown-page.module.css";

const UPCOMING_LIST_LIMIT = 4;
const UPCOMING_OVERLAY_LIMIT = 10;

type HolidayCountdownPageProps = {
  simulatedNow?: number;
};

const getReadableDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-NZ", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Pacific/Auckland",
  });

export default function HolidayCountdownPage({
  simulatedNow,
}: HolidayCountdownPageProps = {}) {
  const [now, setNow] = useState(() => simulatedNow ?? Date.now());
  const [showAllHolidays, setShowAllHolidays] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow((currentNow) =>
        simulatedNow === undefined ? Date.now() : currentNow + 1000,
      );
    }, 1000);

    return () => window.clearInterval(interval);
  }, [simulatedNow]);

  useEffect(() => {
    if (!showAllHolidays) return;

    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowAllHolidays(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showAllHolidays]);

  const holidayOccurrences = getUpcomingHolidayOccurrences(
    holidays,
    now,
    UPCOMING_OVERLAY_LIMIT + 1,
  );
  const nextOccurrence = holidayOccurrences[0];

  if (!nextOccurrence) {
    return (
      <main className={styles.emptyState}>
        No upcoming New Zealand public holidays are loaded yet.
      </main>
    );
  }

  const nextHoliday = nextOccurrence.holiday;
  const countdown = getCountdownParts(nextOccurrence.date, now);
  const countdownValues = formatCountdownValues(countdown);
  const upcomingHolidays = holidayOccurrences.slice(1, UPCOMING_LIST_LIMIT + 1);
  const allUpcomingHolidays = holidayOccurrences.slice(1);

  const renderHolidayRow = (occurrence: HolidayOccurrence) => {
    const rowCountdown = getCountdownParts(occurrence.date, now);
    const [days, hours, minutes, seconds] = formatCountdownValues(rowCountdown);

    return (
      <article className={styles.holidayRow} key={`${occurrence.holiday.name}-${occurrence.date}`}>
        <div>
          <a
            href={occurrence.holiday.infoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Learn more about ${occurrence.holiday.name}`}
          >
            {occurrence.holiday.name}
            <ArrowTopRightOnSquareIcon aria-hidden="true" />
          </a>
          <time dateTime={occurrence.date}>{getReadableDate(occurrence.date)}</time>
        </div>
        <div className={styles.rowCountdown} suppressHydrationWarning>
          <span>IN</span>
          {days}d {hours}h {minutes}m {seconds}s
        </div>
      </article>
    );
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.siteMark}>
            <span>AOTEAROA</span>
            <span>NEW ZEALAND</span>
            <span>PUBLIC HOLIDAY COUNTDOWN</span>
          </div>

          <p className={styles.eyebrow}>NEXT PUBLIC HOLIDAY — AOTEAROA NEW ZEALAND</p>
          <h1>{nextHoliday.name}</h1>
          <time className={styles.heroDate} dateTime={nextOccurrence.date}>
            {getReadableDate(nextOccurrence.date)}
          </time>

          <div className={styles.countdown} aria-label="Countdown to Labour Day">
            {[
              [countdownValues[0], "DAYS"],
              [countdownValues[1], "HOURS"],
              [countdownValues[2], "MINUTES"],
              [countdownValues[3], "SECONDS"],
            ].map(([value, label], index) => (
              <Fragment key={label}>
                {index > 0 && <span className={styles.countdownDivider}>:</span>}
                <div className={styles.countdownUnit}>
                  <strong suppressHydrationWarning>{value}</strong>
                  <span>{label}</span>
                </div>
              </Fragment>
            ))}
          </div>

          <a
            className={styles.historyLink}
            href={nextHoliday.infoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Why we get the day off <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className={styles.eightStage} aria-label="Eight hours work, eight hours sleep, eight hours our own">
          <div className={`${styles.eightFigure} ${styles.workEight}`}>
            <p>8 HOURS WORK</p>
            <div className={styles.eightLoop}>
              <span className={styles.eightLoopInner}>
                <BriefcaseIcon aria-hidden="true" />
              </span>
            </div>
            <div className={styles.eightLoop}>
              <span className={styles.eightLoopInner}>
                <strong>WORK</strong>
                <small>8 HOURS</small>
              </span>
            </div>
          </div>

          <div className={`${styles.eightFigure} ${styles.sleepEight}`}>
            <p>8 HOURS SLEEP</p>
            <div className={styles.eightLoop}>
              <span className={styles.eightLoopInner}>
                <MoonIcon aria-hidden="true" />
              </span>
            </div>
            <div className={styles.eightLoop}>
              <span className={styles.eightLoopInner}>
                <strong>REST</strong>
                <small>A HARD-WON RIGHT</small>
              </span>
            </div>
          </div>

          <div className={`${styles.eightFigure} ${styles.oursEight}`}>
            <p>8 HOURS OUR OWN</p>
            <div className={styles.eightLoop}>
              <span className={styles.eightLoopInner}>
                <SunIcon aria-hidden="true" />
              </span>
            </div>
            <div className={styles.eightLoop}>
              <span className={styles.eightLoopInner}>
                <strong>OURS</strong>
                <small>THE LONG WEEKEND</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.upcomingSection} aria-labelledby="upcoming-title">
        <div className={styles.upcomingHeader}>
          <div>
            <p>KEEP AN EYE ON THE CALENDAR</p>
            <h2 id="upcoming-title">Upcoming public holidays</h2>
          </div>
        </div>

        <div className={styles.holidayList}>{upcomingHolidays.map(renderHolidayRow)}</div>

        {allUpcomingHolidays.length > upcomingHolidays.length && (
          <button
            type="button"
            className={styles.showMoreButton}
            onClick={() => setShowAllHolidays(true)}
          >
            Show next {allUpcomingHolidays.length} holidays
            <ChevronRightIcon aria-hidden="true" />
          </button>
        )}
      </section>

      {showAllHolidays && (
        <div className={styles.dialogShell} role="dialog" aria-modal="true" aria-label="Next public holidays">
          <button
            className={styles.dialogBackdrop}
            type="button"
            aria-label="Close holiday list"
            onClick={() => setShowAllHolidays(false)}
          />
          <div className={styles.dialogPanel}>
            <div className={styles.dialogHeader}>
              <div>
                <span>UP NEXT</span>
                <h2>Next {allUpcomingHolidays.length} public holidays</h2>
              </div>
              <button type="button" aria-label="Close" onClick={() => setShowAllHolidays(false)}>
                <XMarkIcon aria-hidden="true" />
              </button>
            </div>
            <div className={styles.dialogList}>{allUpcomingHolidays.map(renderHolidayRow)}</div>
          </div>
        </div>
      )}
    </main>
  );
}
