"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";


type Holiday = {
  name: string;
  date: string;
  countdown?: string;
}

const holidaysMetadata: Holiday[] = [
  {
    name: "Matariki",   
    date: "2026-07-10",
  },
  {
    name: "Labour Day",
    date: "2026-10-06",
  }
]; 

const getCountDown = (holiday: Holiday) => {
  const now = new Date();
  const target = new Date(holiday.date);
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return "It's here! 🎉";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}


export default function Home() {
  const [holidays, setHolidays] = useState<Holiday[]>(holidaysMetadata);

  useEffect(() => {
    const interval = setInterval(() => {
      setHolidays(holidaysMetadata.map((holiday) => ({
        ...holiday,
        countdown: getCountDown(holiday),
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-16 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            When is the next NZ Public Holiday?{" "}
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {holidays.map((holiday) => (
              <div key={holiday.name}>
                <strong>{holiday.name}</strong>: {holiday.date} - {holiday.countdown}
              </div>
            ))}
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
