import { Flag } from "lucide-react";
import type { CardPriority } from "@/app/_lib/kanban-types";

export function PriorityBadge({ priority }: { priority: CardPriority }) {
  const className =
    priority === "高"
      ? "bg-danger-soft text-danger-foreground"
      : priority === "中"
        ? "bg-warning-soft text-warning-foreground"
        : "bg-info-soft text-info-foreground";

  return (
    <span
      className={`${className} flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold select-none`}
    >
      <Flag aria-hidden="true" size={12} strokeWidth={1.8} />
      {priority}
    </span>
  );
}
