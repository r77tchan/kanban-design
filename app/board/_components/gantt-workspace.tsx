import {
  ChartGantt,
  Flag,
  ListFilter,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { AssigneeStack } from "@/app/_components/avatar";
import { PriorityBadge } from "@/app/_components/priority-badge";
import type {
  Activity,
  BoardDetail,
  GanttTask,
  Milestone,
  TimelineDay,
} from "@/app/_lib/kanban-types";
import {
  getTimelineColumnClassName,
  getTimelineGridTemplate,
  hexToRgba,
} from "../_lib/gantt";
import { BoardSidePanels } from "./board-side-panels";

export function GanttWorkspace({
  activities,
  board,
  ganttTasks,
  isWorkspaceWide,
  milestones,
  onWorkspaceWideToggle,
  timelineDays,
  todayColumn,
}: {
  activities: Activity[];
  board: BoardDetail;
  ganttTasks: GanttTask[];
  isWorkspaceWide: boolean;
  milestones: Milestone[];
  onWorkspaceWideToggle: () => void;
  timelineDays: TimelineDay[];
  todayColumn: number;
}) {
  const layoutToggleLabel = isWorkspaceWide
    ? "情報を右側に戻す"
    : "ガントを横いっぱいに表示";
  const timelineGridTemplate = getTimelineGridTemplate(timelineDays);

  return (
    <div
      className={`grid min-w-0 items-start gap-4 ${
        isWorkspaceWide
          ? "xl:grid-cols-1"
          : "xl:grid-cols-[minmax(0,1fr)_20rem]"
      }`}
    >
      <section
        aria-labelledby="gantt-title"
        className="border-border bg-surface min-w-0 rounded-lg border shadow-sm"
      >
        <div className="border-border flex flex-col gap-3 border-b px-4 py-3 select-none sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <ChartGantt
              aria-hidden="true"
              className="text-muted shrink-0"
              size={18}
              strokeWidth={1.8}
            />
            <h2
              className="text-foreground text-base font-semibold select-text"
              id="gantt-title"
            >
              ガント
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="border-border bg-surface-muted text-surface-foreground hover:bg-surface focus-visible:outline-focus flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold whitespace-nowrap select-none focus-visible:outline-2 focus-visible:outline-offset-2"
              type="button"
            >
              <Flag aria-hidden="true" size={14} strokeWidth={1.8} />
              マイルストーン編集
            </button>
            <button
              className="border-border bg-surface-muted text-surface-foreground hover:bg-surface focus-visible:outline-focus flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold whitespace-nowrap select-none focus-visible:outline-2 focus-visible:outline-offset-2"
              type="button"
            >
              <ListFilter aria-hidden="true" size={14} strokeWidth={1.8} />
              表示条件
            </button>
            <button
              aria-label={layoutToggleLabel}
              aria-pressed={isWorkspaceWide}
              className="text-muted hover:bg-surface-muted hover:text-foreground focus-visible:outline-focus hidden size-8 cursor-pointer place-items-center rounded-md select-none focus-visible:outline-2 focus-visible:outline-offset-2 xl:grid"
              onClick={onWorkspaceWideToggle}
              title={layoutToggleLabel}
              type="button"
            >
              {isWorkspaceWide ? (
                <PanelRightOpen
                  aria-hidden="true"
                  size={18}
                  strokeWidth={1.8}
                />
              ) : (
                <PanelRightClose
                  aria-hidden="true"
                  size={18}
                  strokeWidth={1.8}
                />
              )}
            </button>
          </div>
        </div>

        <div aria-label="ガントタイムライン" className="overflow-x-auto">
          <div className="min-w-[94rem]">
            <div className="border-border grid grid-cols-[18rem_minmax(76rem,1fr)] border-b select-none">
              <div className="border-border bg-surface-muted text-muted border-r px-4 py-3 text-xs font-semibold">
                タスク
              </div>
              <div
                className="bg-surface-muted grid"
                style={{ gridTemplateColumns: timelineGridTemplate }}
              >
                {timelineDays.map((day, index) => (
                  <div
                    className={`border-border text-muted border-r px-2 py-2.5 text-center text-xs font-semibold last:border-r-0 ${getTimelineColumnClassName(
                      {
                        day,
                        index,
                        todayColumn,
                        variant: "header",
                      },
                    )}`}
                    key={`timeline-day-${index}`}
                  >
                    <span className="block leading-none">{day.date}</span>
                    <span className="mt-1 block text-[10px] leading-none font-medium">
                      {day.weekday}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <GanttMilestoneBand
              milestones={milestones}
              timelineDays={timelineDays}
              timelineGridTemplate={timelineGridTemplate}
              todayColumn={todayColumn}
            />

            <div>
              {ganttTasks.map((task) => (
                <GanttTaskRow
                  key={task.id}
                  task={task}
                  timelineDays={timelineDays}
                  timelineGridTemplate={timelineGridTemplate}
                  todayColumn={todayColumn}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <BoardSidePanels
        activities={activities}
        isWorkspaceWide={isWorkspaceWide}
        members={board.members}
      />
    </div>
  );
}

function GanttMilestoneBand({
  milestones,
  timelineDays,
  timelineGridTemplate,
  todayColumn,
}: {
  milestones: Milestone[];
  timelineDays: TimelineDay[];
  timelineGridTemplate: string;
  todayColumn: number;
}) {
  return (
    <div className="border-border grid min-h-14 grid-cols-[18rem_minmax(76rem,1fr)] border-b select-none">
      <div className="border-border bg-surface text-muted flex items-center border-r px-4 py-3 text-xs font-semibold">
        マイルストーン
      </div>
      <div className="relative min-h-14 py-2">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid"
          style={{ gridTemplateColumns: timelineGridTemplate }}
        >
          {timelineDays.map((day, index) => (
            <span
              className={`border-border border-r last:border-r-0 ${getTimelineColumnClassName(
                {
                  day,
                  index,
                  todayColumn,
                  variant: "body",
                },
              )}`}
              key={`milestone-${day.date}`}
            />
          ))}
        </div>
        <div
          className="relative grid min-h-10 gap-y-1"
          style={{
            gridTemplateColumns: timelineGridTemplate,
            gridTemplateRows: "1.25rem 1.25rem",
          }}
        >
          <span
            className="bg-danger-soft text-danger-foreground flex h-6 w-[4.25rem] items-center justify-center justify-self-center rounded-md text-center text-[11px] leading-none font-semibold"
            style={{ gridColumn: `${todayColumn} / span 1`, gridRow: 1 }}
          >
            今日
          </span>
          {milestones.map((milestone) => (
            <span
              aria-label={`${milestone.date} ${milestone.label}`}
              className="border-border bg-surface text-surface-foreground flex w-[4.25rem] min-w-0 items-center justify-center gap-0.5 justify-self-center rounded-md border px-1.5 py-1 text-[10px] font-semibold whitespace-nowrap shadow-sm"
              key={milestone.label}
              style={{
                gridColumn: `${milestone.column} / span 1`,
                gridRow: 2,
              }}
              title={`${milestone.date} ${milestone.label}`}
            >
              <Flag
                aria-hidden="true"
                className="text-muted"
                size={11}
                strokeWidth={1.8}
              />
              <span className="min-w-0 truncate">{milestone.shortLabel}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function GanttTaskRow({
  task,
  timelineDays,
  timelineGridTemplate,
  todayColumn,
}: {
  task: GanttTask;
  timelineDays: TimelineDay[];
  timelineGridTemplate: string;
  todayColumn: number;
}) {
  const columnBadgeColor = hexToRgba(task.color, 0.13);
  const columnBadgeBorderColor = hexToRgba(task.color, 0.32);

  return (
    <div className="border-border grid min-h-22 grid-cols-[18rem_minmax(76rem,1fr)] border-b last:border-b-0">
      <div className="border-border min-w-0 border-r px-4 py-3">
        <div className="min-w-0">
          <div className="mb-1 flex min-w-0 items-center gap-2">
            <span
              className="shrink-0 rounded-md border px-1.5 py-0.5 text-[11px] font-semibold"
              style={{
                backgroundColor: columnBadgeColor,
                borderColor: columnBadgeBorderColor,
                color: task.color,
              }}
            >
              {task.columnTitle}
            </span>
            <PriorityBadge priority={task.priority} />
          </div>
          <h3 className="text-foreground truncate text-sm font-semibold">
            {task.title}
          </h3>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-muted min-w-0 truncate text-xs font-medium">
              {task.startDate} - {task.endDate}
            </p>
            <AssigneeStack members={task.assignees} />
          </div>
        </div>
      </div>

      <div className="relative min-h-22 py-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid"
          style={{ gridTemplateColumns: timelineGridTemplate }}
        >
          {timelineDays.map((day, index) => (
            <span
              className={`border-border border-r last:border-r-0 ${getTimelineColumnClassName(
                {
                  day,
                  index,
                  todayColumn,
                  variant: "body",
                },
              )}`}
              key={`${task.id}-${day.date}`}
            />
          ))}
        </div>
        <div
          className="relative grid h-10"
          style={{ gridTemplateColumns: timelineGridTemplate }}
        >
          <div
            aria-label={`${task.title}の期間`}
            className="relative flex h-full min-w-0 cursor-grab items-center overflow-hidden rounded-md px-3 text-xs font-semibold text-white shadow-sm select-none active:cursor-grabbing"
            style={{
              backgroundColor: task.color,
              gridColumn: `${task.startColumn} / ${task.endColumn + 1}`,
            }}
          >
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-1 h-5 w-1 -translate-y-1/2 rounded-full bg-white/65"
            />
            <span className="truncate px-2">{task.title}</span>
            <span
              aria-hidden="true"
              className="absolute top-1/2 right-1 h-5 w-1 -translate-y-1/2 rounded-full bg-white/65"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
