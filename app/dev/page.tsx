import HolidayCountdownPage from "@/app/components/holiday-countdown-page";
import { notFound } from "next/navigation";

type DevPageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function Dev({ searchParams }: DevPageProps) {
  const { date } = await searchParams;
  const simulatedNow = date ? new Date(date).getTime() : undefined;
  const validSimulatedNow =
    simulatedNow !== undefined && !isNaN(simulatedNow) ? simulatedNow : undefined;

    if (process.env.NODE_ENV === 'production') {
        return notFound();
    }

  return <HolidayCountdownPage simulatedNow={validSimulatedNow} />;
}
