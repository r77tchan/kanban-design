import {
  activities,
  ganttSchedules,
  milestones,
  productBoard,
  timelineDays,
  todayColumn,
} from "@/app/_lib/kanban-data";
import { BoardPageClient } from "./_components/board-page-client";

export default function BoardPage() {
  return (
    <BoardPageClient
      activities={activities}
      board={productBoard}
      ganttSchedules={ganttSchedules}
      milestones={milestones}
      timelineDays={timelineDays}
      todayColumn={todayColumn}
    />
  );
}
