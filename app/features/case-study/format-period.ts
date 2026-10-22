import type { ProjectFrontmatter } from "~/content/schemas";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split("-");
  const monthName = monthNames[Number(month) - 1];
  return monthName && year ? `${monthName} ${year}` : yearMonth;
}

/** "Jul 2026 – present". */
export function formatPeriod(period: ProjectFrontmatter["period"]): string {
  const start = formatYearMonth(period.start);
  return `${start} – ${period.end ? formatYearMonth(period.end) : "present"}`;
}
