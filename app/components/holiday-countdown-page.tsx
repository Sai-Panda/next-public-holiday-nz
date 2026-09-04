"use client";

import { CSSProperties, Fragment, useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowTopRightOnSquareIcon,
  BriefcaseIcon,
  ChevronRightIcon,
  MoonIcon,
  SparklesIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { holidays } from "../types/holidays";
import {
  formatCountdownValues,
  getCountdownParts,
  getCurrentHolidayOccurrences,
  getUpcomingHolidayOccurrences,
  HolidayOccurrence,
} from "../util/holiday.util";
import styles from "./holiday-countdown-page.module.css";
import { PhotoCredit } from "./photo-credit";
import pohutukawaImage from "../../public/pohutukawa-christmas.jpg";
import waitangiTreatyImage from "../../public/te-tiriti-waitangi-sheet.jpg";

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

const getActualDate = (occurrence: HolidayOccurrence) =>
  occurrence.holiday.actualDateByObservedDate?.[occurrence.date];

const getTodayMessage = (holidayName: string) => {
  if (holidayName === "Christmas Day") return "Meri Kirihimete";

  return "Enjoy the public holiday";
};

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
  const [currentOccurrence] = getCurrentHolidayOccurrences(holidays, now);
  const nextOccurrence = holidayOccurrences[0];

  if (!nextOccurrence) {
    return (
      <main className={styles.emptyState}>
        No upcoming New Zealand public holidays are loaded yet.
      </main>
    );
  }

  const nextHoliday = nextOccurrence.holiday;
  const nextActualDate = getActualDate(nextOccurrence);
  const currentActualDate = currentOccurrence
    ? getActualDate(currentOccurrence)
    : undefined;
  const isLabourDay = nextHoliday.name === "Labour Day";
  const isNewYearsDay = nextHoliday.name === "New Year's Day";
  const isDayAfterNewYearsDay = nextHoliday.name === "Day after New Year's Day";
  const isWaitangiDay = nextHoliday.name === "Waitangi Day";
  const isChristmasDay = nextHoliday.name === "Christmas Day";
  const isBoxingDay = nextHoliday.name === "Boxing Day";
  const countdown = getCountdownParts(nextOccurrence.date, now);
  const countdownValues = formatCountdownValues(countdown);
  const upcomingHolidays = holidayOccurrences.slice(1, UPCOMING_LIST_LIMIT + 1);
  const allUpcomingHolidays = holidayOccurrences.slice(1);

  const renderHolidayRow = (occurrence: HolidayOccurrence) => {
    const rowCountdown = getCountdownParts(occurrence.date, now);
    const [days, hours, minutes, seconds] = formatCountdownValues(rowCountdown);
    const accentColor = occurrence.holiday.theme?.accentColor;
    const actualDate = getActualDate(occurrence);

    return (
      <article
        className={`${styles.holidayRow} ${accentColor ? styles.themedHolidayRow : ""}`}
        key={`${occurrence.holiday.name}-${occurrence.date}`}
        style={
          accentColor
            ? ({ "--row-accent": accentColor } as CSSProperties)
            : undefined
        }
      >
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
          <time dateTime={occurrence.date}>
            {actualDate ? "Observed · " : ""}
            {getReadableDate(occurrence.date)}
          </time>
          {actualDate && (
            <time className={styles.actualHolidayDate} dateTime={actualDate}>
              Actual date · {getReadableDate(actualDate)}
            </time>
          )}
        </div>
        <div className={styles.rowCountdown} suppressHydrationWarning>
          <span>IN</span>
          {days}d {hours}h {minutes}m {seconds}s
        </div>
      </article>
    );
  };

  const heroClassName = isLabourDay
    ? styles.hero
    : isNewYearsDay
      ? `${styles.hero} ${styles.newYearHero}`
      : isDayAfterNewYearsDay
        ? `${styles.hero} ${styles.dayAfterNewYearHero}`
        : isWaitangiDay
          ? `${styles.hero} ${styles.waitangiHero}`
          : isChristmasDay
            ? `${styles.hero} ${styles.christmasHero} ${styles.christmasCoastal}`
            : isBoxingDay
              ? `${styles.hero} ${styles.boxingHero}`
              : `${styles.hero} ${styles.genericHero}`;

  const pageStyle = {
    "--holiday-accent": nextHoliday.theme?.accentColor ?? "#df3b20",
    "--upcoming-accent": nextHoliday.theme?.accentColor ?? "#df3b20",
    "--today-holiday-accent": currentOccurrence?.holiday.theme?.accentColor ?? "#efb80b",
  } as CSSProperties;

  return (
    <main className={styles.page} style={pageStyle}>
      {currentOccurrence && (
        <section
          className={styles.todayBanner}
          aria-label={`Today is ${currentOccurrence.holiday.name}`}
        >
          <span>Today in Aotearoa</span>
          <strong>{currentOccurrence.holiday.name}</strong>
          <p>
            {currentActualDate ? "Observed · " : ""}
            {getReadableDate(currentOccurrence.date)}
            {currentActualDate && ` · Actual date: ${getReadableDate(currentActualDate)}`} · {getTodayMessage(currentOccurrence.holiday.name)}
          </p>
        </section>
      )}
      <section className={heroClassName}>
        <div className={styles.heroCopy}>
          <div className={styles.siteMark}>
            <span>AOTEAROA</span>
            <span>NEW ZEALAND</span>
            <span>PUBLIC HOLIDAY COUNTDOWN</span>
          </div>

          <p className={styles.eyebrow}>
            NEXT PUBLIC HOLIDAY — AOTEAROA NEW ZEALAND
          </p>
          <h1>{nextHoliday.name}</h1>
          <time className={styles.heroDate} dateTime={nextOccurrence.date}>
            {nextActualDate ? "Observed · " : ""}
            {getReadableDate(nextOccurrence.date)}
          </time>
          {nextActualDate && (
            <p className={styles.actualDateNote}>
              Actual date · <time dateTime={nextActualDate}>{getReadableDate(nextActualDate)}</time>
            </p>
          )}

          <div className={styles.countdown} aria-label={`Countdown to ${nextHoliday.name}`}>
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
            {isLabourDay
              ? "Why we get the day off"
              : isChristmasDay
                ? "The story of a Kiwi Christmas"
                : isBoxingDay
                  ? "The story behind Boxing Day"
                : `Learn more about ${nextHoliday.name}`} {" "}
            <span aria-hidden="true">→</span>
          </a>

        </div>

        {isChristmasDay && (
          <div className={styles.christmasStage}>
            <div className={styles.christmasStamp} aria-label="Meri Kirihimete, Christmas in Aotearoa">
              <span>MERI</span>
              <strong>KIRIHIMETE</strong>
              <small>AOTEAROA • 25 DECEMBER</small>
            </div>

            <div className={`${styles.pohutukawaPlaceholder} ${styles.pohutukawaPhotoFrame}`}>
                <Image
                  src={pohutukawaImage}
                  alt="Two pōhutukawa trees covered in crimson flowers beside the water at Cornwallis Beach, West Auckland"
                  fill
                  priority
                  sizes="(max-width: 1150px) 100vw, 55vw"
                  className={styles.pohutukawaPhoto}
                />
                <div className={styles.photoGradient} aria-hidden="true" />
                <div className={styles.photoLabel}>
                  <span>PŌHUTUKAWA SEASON</span>
                  <strong>CORNWALLIS BEACH · WEST AUCKLAND</strong>
                </div>
                <PhotoCredit
                  photographer="WikiImages"
                  href="https://pixabay.com/photos/tree-blossom-bloom-red-flowers-red-141884/"
                />
            </div>

            <p className={styles.christmasCaption}>
              <strong>NEW ZEALAND’S CHRISTMAS TREE</strong>
              <span>Salt air, summer light, and a pōhutukawa in bloom.</span>
            </p>
          </div>
        )}

        {isLabourDay && (
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
        )}

        {isNewYearsDay && (
          <div
            className={styles.newYearStage}
            role="img"
            aria-label="A low golden sun rising over an abstract horizon, representing first light in Aotearoa"
          >
            <div className={styles.newYearSun} aria-hidden="true" />
            <div className={styles.newYearHorizon} aria-hidden="true" />
            <SparklesIcon
              className={`${styles.newYearSparkle} ${styles.newYearSparkleOne}`}
              aria-hidden="true"
            />
            <SparklesIcon
              className={`${styles.newYearSparkle} ${styles.newYearSparkleTwo}`}
              aria-hidden="true"
            />
            <p className={styles.newYearCaption}>
              <strong>FIRST LIGHT</strong>
              <span>A NEW YEAR IN AOTEAROA</span>
            </p>
          </div>
        )}

        {isDayAfterNewYearsDay && (
          <div
            className={styles.dayAfterNewYearStage}
            role="img"
            aria-label="A torn calendar page for New Year's Day revealing one more day off"
          >
            <div className={styles.dayAfterNewYearCalendar}>
              <div className={styles.dayAfterNewYearRevealedPage}>
                <span>PUBLIC HOLIDAY</span>
                <strong>ONE MORE<br />DAY OFF</strong>
              </div>
              <div className={styles.dayAfterNewYearTornPage}>
                <strong>NEW YEAR&apos;S DAY</strong>
              </div>
            </div>
            <p className={styles.dayAfterNewYearCaption}>
              <strong>TURN THE PAGE</strong>
              <span>THE SUMMER BREAK KEEPS GOING.</span>
            </p>
          </div>
        )}

        {isWaitangiDay && (
          <div className={styles.waitangiStage}>
            <div className={styles.waitangiTreatyFrame}>
              <Image
                src={waitangiTreatyImage}
                alt="The Waitangi Sheet of Te Tiriti o Waitangi, drawn up on 5 February 1840 and signed at Waitangi and elsewhere around Aotearoa New Zealand"
                priority
                sizes="(max-width: 720px) 76vw, (max-width: 1150px) 360px, 396px"
                className={styles.waitangiTreatyImage}
              />
            </div>
            <p className={styles.waitangiCaption}>
              <strong>TE TIRITI O WAITANGI · WAITANGI SHEET</strong>
              <span>Drawn up 5 February 1840 · Archives ref. IA9/9 Sheet 1</span>
              <a
                href="https://www.flickr.com/photos/archivesnz/15858996150/in/album-72157640803885745"
                target="_blank"
                rel="noopener noreferrer"
              >
                ARCHIVES NEW ZEALAND ↗
              </a>
            </p>
          </div>
        )}

        {isBoxingDay && (
          <div
            className={styles.boxingStage}
            role="img"
            aria-label="An abstract Christmas box, representing Boxing Day's tradition of gifts and gratuities for workers"
          >
            <div className={styles.boxingParcel}>
              <div className={styles.boxingLid} aria-hidden="true" />
            </div>
          </div>
        )}
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
