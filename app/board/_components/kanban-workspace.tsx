import {
  GripVertical,
  Kanban,
  PanelRightClose,
  PanelRightOpen,
  Pencil,
  Plus,
  Trash2,
  CalendarDays,
  MessageSquare,
} from "lucide-react";
import { AssigneeStack } from "@/app/_components/avatar";
import { IconButton } from "@/app/_components/icon-button";
import { PriorityBadge } from "@/app/_components/priority-badge";
import type {
  Activity,
  BoardDetail,
  KanbanCard,
  KanbanColumn as KanbanColumnType,
} from "@/app/_lib/kanban-types";
import { BoardSidePanels } from "./board-side-panels";

export function KanbanWorkspace({
  activities,
  board,
  isWorkspaceWide,
  onWorkspaceWideToggle,
  resolveDueDateLabel,
}: {
  activities: Activity[];
  board: BoardDetail;
  isWorkspaceWide: boolean;
  onWorkspaceWideToggle: () => void;
  resolveDueDateLabel: (dueDate: string) => string;
}) {
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
            {board.columns.map((column) => (
              <KanbanColumn
                column={column}
                key={column.id}
                resolveDueDateLabel={resolveDueDateLabel}
              />
            ))}
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

function KanbanColumn({
  column,
  resolveDueDateLabel,
}: {
  column: KanbanColumnType;
  resolveDueDateLabel: (dueDate: string) => string;
}) {
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
          tabIndex={-1}
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
          <TaskCard
            card={card}
            key={card.id}
            resolveDueDateLabel={resolveDueDateLabel}
          />
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

function TaskCard({
  card,
  resolveDueDateLabel,
}: {
  card: KanbanCard;
  resolveDueDateLabel: (dueDate: string) => string;
}) {
  const dueDateLabel = resolveDueDateLabel(card.dueDate);

  return (
    <article className="task-card border-border bg-surface text-surface-foreground hover:border-border-strong focus-within:border-border-strong relative rounded-md border p-3 shadow-sm select-none focus-within:shadow-md hover:cursor-pointer hover:shadow-md">
      <button
        aria-label={`${card.title}を開く`}
        className="task-card-button focus-visible:outline-focus absolute inset-0 z-0 cursor-pointer rounded-md border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2"
        type="button"
      />

      <div className="pointer-events-none relative z-10 space-y-3">
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
