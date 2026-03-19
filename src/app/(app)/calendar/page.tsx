import { getAllMilestonesForCalendar } from "@/lib/data";
import CalendarView from "@/components/CalendarView";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const events = await getAllMilestonesForCalendar();

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-lg">Calendario</h2>
          <p className="text-zinc-400 text-sm mt-0.5">
            {events.length} hitos en {new Set(events.map((e) => e.projectId)).size} proyectos
          </p>
        </div>
      </div>

      <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
        <CalendarView events={events} />
      </div>
    </div>
  );
}
