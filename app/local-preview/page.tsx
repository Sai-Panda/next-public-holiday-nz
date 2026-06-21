import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HolidayCountdownPage from "@/app/components/holiday-countdown-page";

type HolidayPreviewPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Holiday preview",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function HolidayPreviewPage({
  searchParams,
}: HolidayPreviewPageProps) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const params = await searchParams;
  const holidayParam = params.holiday;
  const previewNextHolidayName =
    typeof holidayParam === "string" ? holidayParam : undefined;

  return <HolidayCountdownPage previewNextHolidayName={previewNextHolidayName} />;
}
