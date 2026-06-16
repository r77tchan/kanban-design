import type {
  GanttSchedule,
  GanttTask,
  KanbanColumn,
  TimelineDay,
} from "@/app/_lib/kanban-types";

function getCardRecord(cardId: string, columns: KanbanColumn[]) {
  const record = columns
    .flatMap((column) => column.cards.map((card) => ({ card, column })))
    .find(({ card }) => card.id === cardId);

  if (!record) {
    throw new Error(`Card not found: ${cardId}`);
  }

  return record;
}

export function buildGanttTasks({
  columns,
  schedules,
}: {
  columns: KanbanColumn[];
  schedules: GanttSchedule[];
}): GanttTask[] {
  return schedules.map((schedule) => {
    const { card, column } = getCardRecord(schedule.cardId, columns);

    return {
      id: card.id,
      title: card.title,
      columnTitle: column.title,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      assignees: card.assignees,
      priority: card.priority,
      startColumn: schedule.startColumn,
      endColumn: schedule.endColumn,
      color: column.accent,
    };
  });
}

export function getTimelineGridTemplate(timelineDays: TimelineDay[]) {
  return `repeat(${timelineDays.length}, minmax(0, 1fr))`;
}

function formatTimelineDateAsDueDate(day: TimelineDay | undefined) {
  if (!day) {
    return "";
  }

  const [month, date] = day.date.split("/");

  return `${Number(month)}月${Number(date)}日`;
}

export function getDueDateLabel({
  dueDate,
  timelineDays,
  todayColumn,
}: {
  dueDate: string;
  timelineDays: TimelineDay[];
  todayColumn: number;
}) {
  const yesterday = formatTimelineDateAsDueDate(timelineDays[todayColumn - 2]);
  const today = formatTimelineDateAsDueDate(timelineDays[todayColumn - 1]);
  const tomorrow = formatTimelineDateAsDueDate(timelineDays[todayColumn]);

  if (dueDate === "今日" || dueDate === today) {
    return "今日";
  }

  if (dueDate === yesterday) {
    return "昨日";
  }

  if (dueDate === tomorrow) {
    return "明日";
  }

  return dueDate;
}

export function isTodayColumn(index: number, todayColumn: number) {
  return index + 1 === todayColumn;
}

export function isNonWorkingDay(day: TimelineDay) {
  return day.isWeekend || day.isHoliday;
}

export function getTimelineColumnClassName({
  day,
  index,
  todayColumn,
  variant,
}: {
  day: TimelineDay;
  index: number;
  todayColumn: number;
  variant: "header" | "body";
}) {
  if (isTodayColumn(index, todayColumn)) {
    return variant === "header"
      ? "bg-danger-soft text-danger-foreground"
      : "bg-danger-soft/60";
  }

  if (isNonWorkingDay(day)) {
    return variant === "header"
      ? "bg-surface text-surface-foreground"
      : "bg-surface-muted/65";
  }

  return "";
}

export function hexToRgba(hexColor: string, alpha: number) {
  const normalizedHex = hexColor.replace("#", "");
  const red = Number.parseInt(normalizedHex.slice(0, 2), 16);
  const green = Number.parseInt(normalizedHex.slice(2, 4), 16);
  const blue = Number.parseInt(normalizedHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
