import { dayNames, weeklyHours } from "@/data/business";
import { formatMinutes } from "@/lib/hours";

export function HoursTable() {
  return (
    <table className="w-full text-sm">
      <caption className="sr-only">Opening hours by day of the week</caption>
      <tbody>
        {weeklyHours.map((hours, dayIndex) => (
          <tr
            key={dayNames[dayIndex]}
            className="border-b border-cream/10 last:border-b-0"
          >
            <th scope="row" className="py-2.5 pr-4 text-left font-medium">
              {dayNames[dayIndex]}
            </th>
            <td className="py-2.5 text-right tabular-nums text-steel">
              {hours === null
                ? "Open 24 hours"
                : `${formatMinutes(hours.open)} – ${
                    hours.close === 24 * 60
                      ? "12:00 AM"
                      : formatMinutes(hours.close)
                  }`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
