import {
  ArrowLeft,
  CalendarDays,
  ChartGantt,
  ChevronDown,
  Columns3,
  Highlighter,
  Kanban,
  Layers3,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { KeyboardEvent } from "react";
import { IconButton } from "@/app/_components/icon-button";
import type { BoardDetail, BoardViewMode } from "@/app/_lib/kanban-types";

const viewOptions = [
  { label: "カンバン", value: "kanban", Icon: Kanban },
  { label: "ガント", value: "gantt", Icon: ChartGantt },
] satisfies Array<{
  label: string;
  value: BoardViewMode;
  Icon: typeof Kanban;
}>;

export function BoardHeader({
  board,
  onViewChange,
  totalCardCount,
  view,
}: {
  board: BoardDetail;
  onViewChange: (view: BoardViewMode) => void;
  totalCardCount: number;
  view: BoardViewMode;
}) {
  const selectView = (
    nextView: BoardViewMode,
    groupElement?: HTMLFieldSetElement,
  ) => {
    onViewChange(nextView);

    if (groupElement) {
      window.requestAnimationFrame(() => {
        groupElement
          .querySelector<HTMLInputElement>(
            `input[name="board-view-mode"][value="${nextView}"]`,
          )
          ?.focus();
      });
    }
  };

  const handleViewKeyDown = (event: KeyboardEvent<HTMLFieldSetElement>) => {
    const target = event.target;

    if (
      !(target instanceof HTMLInputElement) ||
      target.name !== "board-view-mode"
    ) {
      return;
    }

    const currentIndex = viewOptions.findIndex(
      (option) => option.value === target.value,
    );
    if (currentIndex === -1) {
      return;
    }

    let nextIndex = currentIndex;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (currentIndex + 1) % viewOptions.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex =
          (currentIndex - 1 + viewOptions.length) % viewOptions.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = viewOptions.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectView(viewOptions[nextIndex].value, event.currentTarget);
  };

  return (
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
                <span
                  className="inline-block border-b-2 pb-1"
                  style={{ borderColor: board.themeColor }}
                >
                  {board.name}
                </span>
              </h1>
              <p className="text-surface-foreground max-w-3xl text-sm leading-6">
                {board.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <fieldset
              className="border-border bg-surface-muted flex h-10 gap-px rounded-md border p-px select-none"
              onKeyDown={handleViewKeyDown}
            >
              <legend className="sr-only">表示切り替え</legend>
              {viewOptions.map((option) => {
                const Icon = option.Icon;

                return (
                  <label
                    className={viewToggleClass(view === option.value)}
                    key={option.value}
                  >
                    <input
                      checked={view === option.value}
                      className="sr-only"
                      name="board-view-mode"
                      onChange={() => selectView(option.value)}
                      tabIndex={view === option.value ? 0 : -1}
                      type="radio"
                      value={option.value}
                    />
                    <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
                    {option.label}
                  </label>
                );
              })}
            </fieldset>

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
              {board.columns.length} カラム
            </span>
            <span className="flex items-center gap-1.5">
              <Users aria-hidden="true" size={14} strokeWidth={1.8} />
              {board.members.length} メンバー
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays aria-hidden="true" size={14} strokeWidth={1.8} />
              {board.updatedAt}
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
  );
}

function viewToggleClass(isActive: boolean) {
  return isActive
    ? "bg-brand text-brand-foreground focus-within:outline-focus flex cursor-pointer items-center gap-2 rounded px-3 text-sm font-semibold select-none focus-within:outline-2 focus-within:outline-offset-2"
    : "text-muted hover:bg-surface hover:text-foreground focus-within:outline-focus flex cursor-pointer items-center gap-2 rounded px-3 text-sm font-medium select-none focus-within:outline-2 focus-within:outline-offset-2";
}
