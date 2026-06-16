"use client";

import { useState } from "react";
import type {
  Activity,
  BoardDetail,
  BoardViewMode,
  GanttSchedule,
  Milestone,
  TimelineDay,
} from "@/app/_lib/kanban-types";
import { BoardHeader } from "./board-header";
import { GanttWorkspace } from "./gantt-workspace";
import { KanbanWorkspace } from "./kanban-workspace";
import { buildGanttTasks, getDueDateLabel } from "../_lib/gantt";

export function BoardPageClient({
  activities,
  board,
  ganttSchedules,
  milestones,
  timelineDays,
  todayColumn,
}: {
  activities: Activity[];
  board: BoardDetail;
  ganttSchedules: GanttSchedule[];
  milestones: Milestone[];
  timelineDays: TimelineDay[];
  todayColumn: number;
}) {
  const [view, setView] = useState<BoardViewMode>("kanban");
  const [isWorkspaceWide, setIsWorkspaceWide] = useState(false);
  const ganttTasks = buildGanttTasks({
    columns: board.columns,
    schedules: ganttSchedules,
  });
  const totalCardCount = board.columns.reduce(
    (total, column) => total + column.cards.length,
    0,
  );
  const resolveDueDateLabel = (dueDate: string) =>
    getDueDateLabel({ dueDate, timelineDays, todayColumn });

  return (
    <main className="bg-background flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-[112rem] flex-1 flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        <BoardHeader
          board={board}
          onViewChange={setView}
          totalCardCount={totalCardCount}
          view={view}
        />

        {view === "kanban" ? (
          <KanbanWorkspace
            activities={activities}
            board={board}
            isWorkspaceWide={isWorkspaceWide}
            onWorkspaceWideToggle={() =>
              setIsWorkspaceWide((current) => !current)
            }
            resolveDueDateLabel={resolveDueDateLabel}
          />
        ) : (
          <GanttWorkspace
            activities={activities}
            board={board}
            ganttTasks={ganttTasks}
            isWorkspaceWide={isWorkspaceWide}
            milestones={milestones}
            onWorkspaceWideToggle={() =>
              setIsWorkspaceWide((current) => !current)
            }
            timelineDays={timelineDays}
            todayColumn={todayColumn}
          />
        )}
      </div>
    </main>
  );
}
