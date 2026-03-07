import { ProjectStatus } from "@/types";
import { statusConfig } from "@/lib/utils";

export default function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status as ProjectStatus] ?? statusConfig.planning;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
