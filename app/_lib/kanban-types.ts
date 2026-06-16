export type Member = {
  name: string;
  initial: string;
  color: string;
};

export type UserProfile = Member & {
  email: string;
  passwordUpdatedAt: string;
};

export type BoardSummary = {
  name: string;
  description: string;
  updatedAt: string;
  themeColor: string;
  pinned?: boolean;
  isNew?: boolean;
  cardCount: number;
  columns: string[];
  members: Member[];
};

export type Label = {
  name: string;
  className: string;
};

export type CardPriority = "高" | "中" | "低";

export type KanbanCard = {
  id: string;
  title: string;
  summary: string;
  assignees: Member[];
  dueDate: string;
  priority: CardPriority;
  labels: Label[];
  comments: number;
};

export type KanbanColumn = {
  id: string;
  title: string;
  accent: string;
  cards: KanbanCard[];
};

export type BoardDetail = {
  name: string;
  description: string;
  updatedAt: string;
  themeColor: string;
  members: Member[];
  columns: KanbanColumn[];
};

export type BoardViewMode = "kanban" | "gantt";

export type GanttTask = {
  id: string;
  title: string;
  columnTitle: string;
  startDate: string;
  endDate: string;
  assignees: Member[];
  priority: CardPriority;
  startColumn: number;
  endColumn: number;
  color: string;
};

export type GanttSchedule = {
  cardId: string;
  startDate: string;
  endDate: string;
  startColumn: number;
  endColumn: number;
};

export type TimelineDay = {
  date: string;
  weekday: string;
  isWeekend?: boolean;
  isHoliday?: boolean;
};

export type Milestone = {
  date: string;
  label: string;
  shortLabel: string;
  column: number;
};

export type Activity = {
  user: string;
  action: string;
  dateLabel: string;
  time: string;
};
