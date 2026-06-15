"use client";

import {
  ArrowLeft,
  CalendarDays,
  ChartGantt,
  ChevronDown,
  Columns3,
  Flag,
  GripVertical,
  Highlighter,
  Kanban,
  Layers3,
  ListFilter,
  MessageSquare,
  PanelRightClose,
  PanelRightOpen,
  Pencil,
  Plus,
  Search,
  Settings,
  Timer,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Member = {
  name: string;
  initial: string;
  color: string;
};

type Label = {
  name: string;
  className: string;
};

type Card = {
  id: string;
  title: string;
  summary: string;
  assignees: Member[];
  dueDate: string;
  priority: "高" | "中" | "低";
  labels: Label[];
  comments: number;
};

type Column = {
  id: string;
  title: string;
  accent: string;
  cards: Card[];
};

type ViewMode = "kanban" | "gantt";

type GanttTask = {
  id: string;
  title: string;
  columnTitle: string;
  startDate: string;
  endDate: string;
  assignees: Member[];
  priority: Card["priority"];
  startColumn: number;
  endColumn: number;
  color: string;
};

type GanttSchedule = {
  cardId: string;
  startDate: string;
  endDate: string;
  startColumn: number;
  endColumn: number;
};

type TimelineDay = {
  date: string;
  weekday: string;
  isWeekend?: boolean;
  isHoliday?: boolean;
};

type WorkspaceLayoutProps = {
  isWorkspaceWide: boolean;
  onWorkspaceWideToggle: () => void;
};

const members: Member[] = [
  { name: "山田 太郎", initial: "山", color: "#0f766e" },
  { name: "佐藤 花", initial: "佐", color: "#7c3aed" },
  { name: "田中 誠", initial: "田", color: "#b45309" },
  { name: "Lee Chen", initial: "L", color: "#0e7490" },
  { name: "高橋 葵", initial: "高", color: "#be123c" },
  { name: "井上 蓮", initial: "井", color: "#4338ca" },
];

const labels = {
  planning: { name: "計画", className: "bg-info-soft text-info-foreground" },
  ux: { name: "UX", className: "bg-violet-soft text-violet-foreground" },
  api: { name: "API", className: "bg-success-soft text-success-foreground" },
  qa: { name: "QA", className: "bg-warning-soft text-warning-foreground" },
  release: {
    name: "公開",
    className: "bg-danger-soft text-danger-foreground",
  },
} satisfies Record<string, Label>;

const columns: Column[] = [
  {
    id: "ideas",
    title: "Ideas",
    accent: "#0e7490",
    cards: [
      {
        id: "SK-104",
        title: "ユーザー招待フローの整理",
        summary: "初回招待から権限付与までの分岐を1枚の導線にまとめる",
        assignees: [members[1], members[0]],
        dueDate: "6月18日",
        priority: "高",
        labels: [labels.planning, labels.ux],
        comments: 5,
      },
      {
        id: "SK-118",
        title: "カード詳細ドロワーの情報設計",
        summary: "コメント、添付、履歴を右側で扱える構成を検討する",
        assignees: [members[3], members[1]],
        dueDate: "6月20日",
        priority: "中",
        labels: [labels.ux],
        comments: 2,
      },
    ],
  },
  {
    id: "spec",
    title: "Spec",
    accent: "#7c3aed",
    cards: [
      {
        id: "SK-121",
        title: "権限ロールごとのボード操作定義",
        summary: "編集、削除、カード移動、閲覧のみの境界を仕様化する",
        assignees: [members[2], members[5], members[0]],
        dueDate: "6月19日",
        priority: "高",
        labels: [labels.planning, labels.api],
        comments: 8,
      },
      {
        id: "SK-126",
        title: "ガント表示で使う日付項目の整理",
        summary: "開始日、期限日、依存関係の有無をカード単位で確認する",
        assignees: [members[4]],
        dueDate: "6月21日",
        priority: "中",
        labels: [labels.planning],
        comments: 4,
      },
    ],
  },
  {
    id: "build",
    title: "Build",
    accent: "#0f766e",
    cards: [
      {
        id: "SK-131",
        title: "ボード一覧から詳細への遷移",
        summary: "カード全体リンクと共通ヘッダーのレイアウトを確認する",
        assignees: [members[0], members[3]],
        dueDate: "今日",
        priority: "低",
        labels: [labels.api],
        comments: 3,
      },
      {
        id: "SK-137",
        title: "列ヘッダー操作のビジュアル設計",
        summary: "ドラッグ、編集、削除、追加の優先順位が見える状態にする",
        assignees: [members[5], members[1], members[2]],
        dueDate: "6月22日",
        priority: "中",
        labels: [labels.ux],
        comments: 6,
      },
      {
        id: "SK-142",
        title: "カード追加ボタンの配置比較",
        summary: "全体追加と列内追加の両方が自然に見える密度で検証する",
        assignees: [members[1], members[4]],
        dueDate: "6月23日",
        priority: "低",
        labels: [labels.ux, labels.qa],
        comments: 1,
      },
    ],
  },
  {
    id: "qa",
    title: "QA",
    accent: "#d97706",
    cards: [
      {
        id: "SK-149",
        title: "レスポンシブ時の横スクロール確認",
        summary: "モバイル幅でも列幅と操作ボタンが潰れないことを確認する",
        assignees: [members[4], members[0], members[2], members[5]],
        dueDate: "6月24日",
        priority: "高",
        labels: [labels.qa],
        comments: 7,
      },
      {
        id: "SK-153",
        title: "削除操作の確認モーダル文言",
        summary: "危険操作は通常導線から一段奥に置く設計を反映する",
        assignees: [members[2], members[4], members[3], members[1], members[0]],
        dueDate: "6月25日",
        priority: "中",
        labels: [labels.qa, labels.release],
        comments: 3,
      },
    ],
  },
  {
    id: "launch",
    title: "Launch",
    accent: "#e11d48",
    cards: [
      {
        id: "SK-160",
        title: "公開前チェックリストの最終確認",
        summary: "メタ情報、静的出力、導線確認のチェック項目を揃える",
        assignees: [members[3], members[0], members[5]],
        dueDate: "6月27日",
        priority: "高",
        labels: [labels.release],
        comments: 9,
      },
    ],
  },
];

const timelineDays: TimelineDay[] = [
  { date: "6/14", weekday: "日", isWeekend: true },
  { date: "6/15", weekday: "月" },
  { date: "6/16", weekday: "火" },
  { date: "6/17", weekday: "水" },
  { date: "6/18", weekday: "木" },
  { date: "6/19", weekday: "金" },
  { date: "6/20", weekday: "土", isWeekend: true },
  { date: "6/21", weekday: "日", isWeekend: true },
  { date: "6/22", weekday: "月" },
  { date: "6/23", weekday: "火" },
  { date: "6/24", weekday: "水" },
  { date: "6/25", weekday: "木" },
  { date: "6/26", weekday: "金" },
  { date: "6/27", weekday: "土", isWeekend: true },
  { date: "6/28", weekday: "日", isWeekend: true },
  { date: "6/29", weekday: "月" },
  { date: "6/30", weekday: "火" },
];

const timelineGridTemplate = `repeat(${timelineDays.length}, minmax(0, 1fr))`;
const todayColumn = 11;

function formatTimelineDateAsDueDate(day: TimelineDay | undefined) {
  if (!day) {
    return "";
  }

  const [month, date] = day.date.split("/");

  return `${Number(month)}月${Number(date)}日`;
}

const relativeDueDates = {
  yesterday: formatTimelineDateAsDueDate(timelineDays[todayColumn - 2]),
  today: formatTimelineDateAsDueDate(timelineDays[todayColumn - 1]),
  tomorrow: formatTimelineDateAsDueDate(timelineDays[todayColumn]),
};

function getDueDateLabel(dueDate: string) {
  if (dueDate === "今日" || dueDate === relativeDueDates.today) {
    return "今日";
  }

  if (dueDate === relativeDueDates.yesterday) {
    return "昨日";
  }

  if (dueDate === relativeDueDates.tomorrow) {
    return "明日";
  }

  return dueDate;
}

const cardRecords = columns.flatMap((column) =>
  column.cards.map((card) => ({ card, column })),
);

function getCardRecord(cardId: string) {
  const record = cardRecords.find(({ card }) => card.id === cardId);

  if (!record) {
    throw new Error(`Card not found: ${cardId}`);
  }

  return record;
}

const ganttSchedules = [
  {
    cardId: "SK-104",
    startDate: "6月16日",
    endDate: "6月18日",
    startColumn: 3,
    endColumn: 5,
  },
  {
    cardId: "SK-121",
    startDate: "6月17日",
    endDate: "6月19日",
    startColumn: 4,
    endColumn: 6,
  },
  {
    cardId: "SK-118",
    startDate: "6月18日",
    endDate: "6月20日",
    startColumn: 5,
    endColumn: 7,
  },
  {
    cardId: "SK-126",
    startDate: "6月19日",
    endDate: "6月21日",
    startColumn: 6,
    endColumn: 8,
  },
  {
    cardId: "SK-137",
    startDate: "6月20日",
    endDate: "6月22日",
    startColumn: 7,
    endColumn: 9,
  },
  {
    cardId: "SK-131",
    startDate: "6月21日",
    endDate: "6月24日",
    startColumn: 8,
    endColumn: 11,
  },
  {
    cardId: "SK-142",
    startDate: "6月22日",
    endDate: "6月23日",
    startColumn: 9,
    endColumn: 10,
  },
  {
    cardId: "SK-149",
    startDate: "6月23日",
    endDate: "6月24日",
    startColumn: 10,
    endColumn: 11,
  },
  {
    cardId: "SK-153",
    startDate: "6月24日",
    endDate: "6月25日",
    startColumn: 11,
    endColumn: 12,
  },
  {
    cardId: "SK-160",
    startDate: "6月25日",
    endDate: "6月27日",
    startColumn: 12,
    endColumn: 14,
  },
] satisfies GanttSchedule[];

const ganttTasks: GanttTask[] = ganttSchedules.map((schedule) => {
  const { card, column } = getCardRecord(schedule.cardId);

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

const milestones = [
  { date: "6月18日", label: "仕様レビュー", shortLabel: "レビュー", column: 5 },
  { date: "6月24日", label: "QA完了", shortLabel: "QA", column: 11 },
  { date: "6月27日", label: "公開判定", shortLabel: "公開", column: 14 },
];

const activities = [
  {
    user: "山田 太郎",
    action: "カードを Build に移動",
    dateLabel: "今日",
    time: "10:24",
  },
  {
    user: "高橋 葵",
    action: "カードに期限を設定",
    dateLabel: "今日",
    time: "09:52",
  },
  {
    user: "Lee Chen",
    action: "カードに添付を追加",
    dateLabel: "昨日",
    time: "17:36",
  },
  {
    user: "佐藤 花",
    action: "カードにコメントを追加",
    dateLabel: "6月22日",
    time: "16:10",
  },
];

const totalCardCount = columns.reduce(
  (total, column) => total + column.cards.length,
  0,
);

function isTodayColumn(index: number) {
  return index + 1 === todayColumn;
}

function isNonWorkingDay(day: TimelineDay) {
  return day.isWeekend || day.isHoliday;
}

function getTimelineColumnClassName(
  day: TimelineDay,
  index: number,
  variant: "header" | "body",
) {
  if (isTodayColumn(index)) {
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

export default function BoardPage() {
  const [view, setView] = useState<ViewMode>("kanban");
  const [isWorkspaceWide, setIsWorkspaceWide] = useState(false);

  return (
    <main className="bg-background flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-[112rem] flex-1 flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        <section className="border-border bg-surface rounded-lg border p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 space-y-3">
                <Link
                  className="text-muted hover:bg-surface-muted hover:text-foreground focus-visible:outline-focus inline-flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium select-none focus-visible:outline-2 focus-visible:outline-offset-2"
                  href="/"
                >
                  <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.8} />
                  ボード一覧
                </Link>

                <div className="space-y-2">
                  <h1 className="text-foreground text-2xl font-bold tracking-normal sm:text-3xl">
                    プロダクト計画
                  </h1>
                  <p className="text-surface-foreground max-w-3xl text-sm leading-6">
                    ロードマップ、仕様検討、リリース準備
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <div
                  aria-label="表示切り替え"
                  className="border-border bg-surface-muted flex h-10 gap-px rounded-md border p-px"
                  role="group"
                >
                  <button
                    aria-pressed={view === "kanban"}
                    className={viewToggleClass(view === "kanban")}
                    onClick={() => setView("kanban")}
                    type="button"
                  >
                    <Kanban aria-hidden="true" size={16} strokeWidth={1.8} />
                    カンバン
                  </button>
                  <button
                    aria-pressed={view === "gantt"}
                    className={viewToggleClass(view === "gantt")}
                    onClick={() => setView("gantt")}
                    type="button"
                  >
                    <ChartGantt
                      aria-hidden="true"
                      size={16}
                      strokeWidth={1.8}
                    />
                    ガント
                  </button>
                </div>

                <button
                  className="bg-brand text-brand-foreground focus-visible:outline-focus flex h-10 cursor-pointer items-center gap-2 rounded-md px-3 text-sm font-semibold select-none hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
                  type="button"
                >
                  <Plus aria-hidden="true" size={16} strokeWidth={1.8} />
                  カード追加
                </button>
                <button
                  className="border-border bg-surface-muted text-surface-foreground hover:bg-surface focus-visible:outline-focus flex h-10 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-semibold select-none focus-visible:outline-2 focus-visible:outline-offset-2"
                  type="button"
                >
                  <Columns3 aria-hidden="true" size={16} strokeWidth={1.8} />
                  カラム追加
                </button>
                <div className="flex shrink-0 gap-2">
                  <IconButton label="ボード編集">
                    <Pencil aria-hidden="true" size={16} strokeWidth={1.8} />
                  </IconButton>
                  <IconButton danger label="ボード削除">
                    <Trash2 aria-hidden="true" size={16} strokeWidth={1.8} />
                  </IconButton>
                </div>
              </div>
            </div>

            <div className="border-border flex flex-col gap-3 border-t pt-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="text-muted flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium select-none">
                <span className="flex items-center gap-1.5">
                  <Layers3 aria-hidden="true" size={14} strokeWidth={1.8} />
                  {totalCardCount} カード
                </span>
                <span className="flex items-center gap-1.5">
                  <Columns3 aria-hidden="true" size={14} strokeWidth={1.8} />
                  {columns.length} カラム
                </span>
                <span className="flex items-center gap-1.5">
                  <Users aria-hidden="true" size={14} strokeWidth={1.8} />
                  {members.length} メンバー
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays
                    aria-hidden="true"
                    size={14}
                    strokeWidth={1.8}
                  />
                  今日 10:24
                </span>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="border-border bg-surface-muted text-muted focus-within:outline-focus flex h-10 items-center gap-2 rounded-md border px-3 select-none focus-within:outline-2 focus-within:outline-offset-2 sm:w-64">
                  <Search aria-hidden="true" size={16} strokeWidth={1.8} />
                  <input
                    aria-label="カード検索"
                    className="board-search-input placeholder:text-muted text-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
                    placeholder="カード検索"
                    type="search"
                  />
                </div>
                <button
                  className="border-border bg-surface-muted text-surface-foreground hover:bg-surface focus-visible:outline-focus flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold select-none focus-visible:outline-2 focus-visible:outline-offset-2"
                  type="button"
                >
                  <Highlighter aria-hidden="true" size={16} strokeWidth={1.8} />
                  ハイライト条件
                  <ChevronDown aria-hidden="true" size={14} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {view === "kanban" ? (
          <KanbanWorkspace
            isWorkspaceWide={isWorkspaceWide}
            onWorkspaceWideToggle={() =>
              setIsWorkspaceWide((current) => !current)
            }
          />
        ) : (
          <GanttWorkspace
            isWorkspaceWide={isWorkspaceWide}
            onWorkspaceWideToggle={() =>
              setIsWorkspaceWide((current) => !current)
            }
          />
        )}
      </div>
    </main>
  );
}

function viewToggleClass(isActive: boolean) {
  return isActive
    ? "bg-brand text-brand-foreground focus-visible:outline-focus flex cursor-pointer items-center gap-2 rounded px-3 text-sm font-semibold select-none focus-visible:outline-2 focus-visible:outline-offset-2"
    : "text-muted hover:bg-surface hover:text-foreground focus-visible:outline-focus flex cursor-pointer items-center gap-2 rounded px-3 text-sm font-medium select-none focus-visible:outline-2 focus-visible:outline-offset-2";
}

function KanbanWorkspace({
  isWorkspaceWide,
  onWorkspaceWideToggle,
}: WorkspaceLayoutProps) {
  const layoutToggleLabel = isWorkspaceWide
    ? "情報を右側に戻す"
    : "カンバンを横いっぱいに表示";

  return (
    <div
      className={`grid min-w-0 items-start gap-4 ${
        isWorkspaceWide
          ? "xl:grid-cols-1"
          : "xl:grid-cols-[minmax(0,1fr)_20rem]"
      }`}
    >
      <section
        aria-labelledby="kanban-title"
        className="border-border bg-surface min-w-0 rounded-lg border shadow-sm"
      >
        <div className="border-border flex items-center justify-between gap-3 border-b px-4 py-3 select-none">
          <div className="flex min-w-0 items-center gap-2">
            <Kanban
              aria-hidden="true"
              className="text-muted shrink-0"
              size={18}
              strokeWidth={1.8}
            />
            <h2
              className="text-foreground text-base font-semibold select-text"
              id="kanban-title"
            >
              カンバン
            </h2>
          </div>
          <button
            aria-label={layoutToggleLabel}
            aria-pressed={isWorkspaceWide}
            className="text-muted hover:bg-surface-muted hover:text-foreground focus-visible:outline-focus hidden size-8 cursor-pointer place-items-center rounded-md select-none focus-visible:outline-2 focus-visible:outline-offset-2 xl:grid"
            onClick={onWorkspaceWideToggle}
            title={layoutToggleLabel}
            type="button"
          >
            {isWorkspaceWide ? (
              <PanelRightOpen aria-hidden="true" size={18} strokeWidth={1.8} />
            ) : (
              <PanelRightClose aria-hidden="true" size={18} strokeWidth={1.8} />
            )}
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="flex min-w-max gap-4 p-4">
            {columns.map((column) => (
              <KanbanColumn column={column} key={column.id} />
            ))}
          </div>
        </div>
      </section>

      <aside
        className={`grid gap-4 md:grid-cols-2 ${
          isWorkspaceWide ? "xl:grid-cols-2" : "xl:auto-rows-min xl:grid-cols-1"
        }`}
      >
        <MembersPanel />
        <ActivityPanel />
      </aside>
    </div>
  );
}

function GanttWorkspace({
  isWorkspaceWide,
  onWorkspaceWideToggle,
}: WorkspaceLayoutProps) {
  const layoutToggleLabel = isWorkspaceWide
    ? "情報を右側に戻す"
    : "ガントを横いっぱいに表示";

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
                      day,
                      index,
                      "header",
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

            <GanttMilestoneBand />

            <div>
              {ganttTasks.map((task) => (
                <GanttTaskRow key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <aside
        className={`grid gap-4 md:grid-cols-2 ${
          isWorkspaceWide ? "xl:grid-cols-2" : "xl:auto-rows-min xl:grid-cols-1"
        }`}
      >
        <MembersPanel />
        <ActivityPanel />
      </aside>
    </div>
  );
}

function GanttMilestoneBand() {
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
                day,
                index,
                "body",
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

function GanttTaskRow({ task }: { task: GanttTask }) {
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
                day,
                index,
                "body",
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

function KanbanColumn({ column }: { column: Column }) {
  return (
    <section
      aria-labelledby={`${column.id}-title`}
      className="bg-surface-muted flex w-[19rem] shrink-0 flex-col gap-3 rounded-md p-3 select-none"
    >
      <div
        aria-hidden="true"
        className="h-1 rounded-full"
        style={{ backgroundColor: column.accent }}
      />

      <div className="flex items-start gap-2">
        <button
          aria-label={`${column.title}をドラッグ`}
          className="border-border bg-surface text-muted hover:border-border-strong hover:text-foreground focus-visible:outline-focus grid size-8 shrink-0 cursor-grab place-items-center rounded-md border select-none focus-visible:outline-2 focus-visible:outline-offset-2 active:cursor-grabbing"
          title="ドラッグ"
          type="button"
        >
          <GripVertical aria-hidden="true" size={16} strokeWidth={1.8} />
        </button>
        <div className="min-w-0 flex-1">
          <h3
            className="text-foreground truncate text-sm font-semibold"
            id={`${column.id}-title`}
          >
            {column.title}
          </h3>
          <p className="text-muted text-xs font-medium">
            {column.cards.length} カード
          </p>
        </div>
        <IconButton label={`${column.title}を編集`} small>
          <Pencil aria-hidden="true" size={15} strokeWidth={1.8} />
        </IconButton>
        <IconButton danger label={`${column.title}を削除`} small>
          <Trash2 aria-hidden="true" size={15} strokeWidth={1.8} />
        </IconButton>
      </div>

      <div className="flex flex-col gap-3">
        {column.cards.map((card) => (
          <TaskCard card={card} key={card.id} />
        ))}
      </div>

      <button
        className="border-border text-muted hover:border-border-strong hover:bg-surface hover:text-foreground focus-visible:outline-focus mt-auto flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed text-sm font-semibold select-none focus-visible:outline-2 focus-visible:outline-offset-2"
        type="button"
      >
        <Plus aria-hidden="true" size={16} strokeWidth={1.8} />
        カード追加
      </button>
    </section>
  );
}

function TaskCard({ card }: { card: Card }) {
  const dueDateLabel = getDueDateLabel(card.dueDate);

  return (
    <article className="border-border bg-surface text-surface-foreground hover:border-border-strong rounded-md border p-3 shadow-sm select-none hover:cursor-pointer hover:shadow-md">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="text-foreground text-sm leading-5 font-semibold">
              {card.title}
            </h4>
          </div>
          <PriorityBadge priority={card.priority} />
        </div>

        <p className="text-muted line-clamp-2 text-xs leading-5">
          {card.summary}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {card.labels.map((label) => (
            <span
              className={`${label.className} rounded-md px-2 py-0.5 text-xs font-semibold`}
              key={label.name}
            >
              {label.name}
            </span>
          ))}
        </div>

        <div className="border-border flex items-center justify-between gap-2 border-t pt-3">
          <div className="text-muted flex items-center gap-2 text-xs font-medium">
            <span className="flex items-center gap-1">
              <CalendarDays aria-hidden="true" size={13} strokeWidth={1.8} />
              {dueDateLabel}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare aria-hidden="true" size={13} strokeWidth={1.8} />
              {card.comments}
            </span>
          </div>
          <AssigneeStack members={card.assignees} />
        </div>
      </div>
    </article>
  );
}

function ActivityPanel() {
  return (
    <section className="border-border bg-surface rounded-lg border p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Timer
          aria-hidden="true"
          className="text-muted"
          size={18}
          strokeWidth={1.8}
        />
        <h2 className="text-foreground text-base font-semibold">更新</h2>
      </div>
      <div className="relative space-y-5 pl-4">
        <span
          aria-hidden="true"
          className="bg-border absolute top-1 bottom-1 left-1.5 w-px"
        />
        {activities.map((activity, index) => (
          <div
            className="relative min-w-0"
            key={`${activity.user}-${activity.dateLabel}-${activity.time}`}
          >
            <span
              aria-hidden="true"
              className={`border-surface absolute top-1.5 -left-[0.875rem] size-3 rounded-full border-2 ${
                index === 0 ? "bg-brand" : "bg-border-strong"
              }`}
            />
            <p className="text-muted mb-1 text-xs leading-none font-semibold select-none">
              {activity.dateLabel} {activity.time}
            </p>
            <p className="text-foreground truncate text-sm font-semibold">
              {activity.user}
            </p>
            <p className="text-surface-foreground mt-0.5 text-sm leading-5">
              {activity.action}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MembersPanel() {
  const [owner, ...participantMembers] = members;

  return (
    <section className="border-border bg-surface rounded-lg border p-4 shadow-sm">
      <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Users
            aria-hidden="true"
            className="text-muted shrink-0"
            size={18}
            strokeWidth={1.8}
          />
          <h2 className="text-foreground text-base font-semibold">メンバー</h2>
        </div>
        <button
          aria-label="メンバー管理"
          className="text-muted hover:bg-surface-muted hover:text-foreground focus-visible:outline-focus grid size-8 shrink-0 cursor-pointer place-items-center rounded-md select-none focus-visible:outline-2 focus-visible:outline-offset-2"
          title="メンバー管理"
          type="button"
        >
          <Settings aria-hidden="true" size={16} strokeWidth={1.8} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar framed={false} member={owner} />
          <div className="min-w-0">
            <p className="text-surface-foreground truncate text-sm font-semibold">
              {owner.name}
            </p>
            <p className="text-muted text-xs font-medium">所有者</p>
          </div>
        </div>

        <div className="border-border space-y-3 border-t pt-4">
          <p className="text-muted text-xs font-semibold select-none">
            参加メンバー
          </p>

          {participantMembers.map((member) => (
            <div className="flex min-w-0 items-center gap-3" key={member.name}>
              <Avatar framed={false} member={member} />
              <div className="min-w-0">
                <p className="text-surface-foreground truncate text-sm font-semibold">
                  {member.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="border-border text-muted hover:border-border-strong hover:bg-surface-muted hover:text-foreground focus-visible:outline-focus flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed text-sm font-semibold select-none focus-visible:outline-2 focus-visible:outline-offset-2"
          type="button"
        >
          <Plus aria-hidden="true" size={16} strokeWidth={1.8} />
          メンバー追加
        </button>
      </div>
    </section>
  );
}

function PriorityBadge({ priority }: { priority: Card["priority"] }) {
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

function hexToRgba(hexColor: string, alpha: number) {
  const normalizedHex = hexColor.replace("#", "");
  const red = Number.parseInt(normalizedHex.slice(0, 2), 16);
  const green = Number.parseInt(normalizedHex.slice(2, 4), 16);
  const blue = Number.parseInt(normalizedHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function AssigneeStack({
  maxVisible = 3,
  members,
}: {
  maxVisible?: number;
  members: Member[];
}) {
  const visibleMemberCount =
    members.length === maxVisible + 1
      ? members.length
      : Math.min(members.length, maxVisible);
  const visibleMembers = members.slice(0, visibleMemberCount);
  const hiddenMemberCount = members.length - visibleMembers.length;
  const memberNames = members.map((member) => member.name).join(", ");

  return (
    <div
      aria-label={`担当者: ${memberNames}`}
      className="flex shrink-0 items-center -space-x-2 select-none"
      role="group"
      title={memberNames}
    >
      {visibleMembers.map((member, index) => (
        <span
          className="relative"
          key={member.name}
          style={{ zIndex: visibleMembers.length - index + 1 }}
        >
          <Avatar member={member} />
        </span>
      ))}
      {hiddenMemberCount > 0 ? (
        <span
          aria-label={`ほか${hiddenMemberCount}人`}
          className="border-surface bg-surface-muted text-surface-foreground relative grid size-8 place-items-center rounded-full border-2 text-[11px] font-semibold shadow-sm select-none"
          role="img"
          style={{ zIndex: 1 }}
          title={`ほか${hiddenMemberCount}人`}
        >
          +{hiddenMemberCount}
        </span>
      ) : null}
    </div>
  );
}

function Avatar({
  framed = true,
  member,
}: {
  framed?: boolean;
  member: Member;
}) {
  return (
    <span
      aria-label={member.name}
      className={`grid size-8 place-items-center rounded-full text-xs font-semibold text-white select-none ${
        framed ? "border-surface border-2 shadow-sm" : ""
      }`}
      role="img"
      style={{ backgroundColor: member.color }}
      title={member.name}
    >
      {member.initial}
    </span>
  );
}

function IconButton({
  children,
  danger = false,
  label,
  small = false,
}: {
  children: React.ReactNode;
  danger?: boolean;
  label: string;
  small?: boolean;
}) {
  return (
    <button
      aria-label={label}
      className={`border-border bg-surface-muted focus-visible:outline-focus grid shrink-0 cursor-pointer place-items-center rounded-md border select-none focus-visible:outline-2 focus-visible:outline-offset-2 ${
        small ? "size-8" : "size-10"
      } ${
        danger
          ? "text-danger-foreground hover:bg-danger-soft"
          : "text-surface-foreground hover:bg-surface"
      }`}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}
