import HolidayCountdownPage from "@/app/components/holiday-countdown-page";

type DevPageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function Dev({ searchParams }: DevPageProps) {
  const { date } = await searchParams;
  const simulatedNow = date ? new Date(date).getTime() : undefined;
  const validSimulatedNow =
    simulatedNow !== undefined && !isNaN(simulatedNow) ? simulatedNow : undefined;

  return <HolidayCountdownPage simulatedNow={validSimulatedNow} />;
}
