import { CalendarDays, Columns3, Grip, Layers3, Users } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/app/_components/avatar";
import type { BoardSummary } from "@/app/_lib/kanban-types";

const memberDisplaySlotCount = 6;

export function BoardCard({
  board,
  isPinned = false,
}: {
  board: BoardSummary;
  isPinned?: boolean;
}) {
  const visibleMemberCount =
    board.members.length > memberDisplaySlotCount
      ? memberDisplaySlotCount - 1
      : memberDisplaySlotCount;
  const hiddenMemberCount = board.members.length - visibleMemberCount;

  return (
    <article className="board-card border-border bg-surface text-surface-foreground relative flex min-h-full flex-col gap-5 rounded-lg border p-5 shadow-sm select-none">
      <Link
        aria-label={`${board.name} のボードを開く`}
        className="board-card-link absolute inset-0 z-0 rounded-lg"
        href="/board"
      />

      <div className="pointer-events-none relative z-10 flex min-h-full flex-col gap-5">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-foreground text-lg leading-7 font-semibold">
                <span
                  className="inline-block border-b-2 pb-0.5"
                  style={{ borderColor: board.themeColor }}
                >
                  {board.name}
                </span>
              </h3>
              {board.isNew ? (
                <span className="bg-status-new-soft text-status-new-foreground rounded-md px-2 py-0.5 text-xs font-semibold">
                  新着
                </span>
              ) : null}
            </div>
            <p className="text-sm leading-6">{board.description}</p>
          </div>

          {isPinned ? (
            <button
              data-drag-handle
              aria-label={`${board.name}をドラッグ`}
              className="border-border bg-surface text-muted pointer-events-auto grid size-7 shrink-0 cursor-grab place-items-center rounded border select-none active:cursor-grabbing"
              tabIndex={-1}
              type="button"
            >
              <Grip aria-hidden="true" size={15} strokeWidth={1.9} />
            </button>
          ) : null}
        </div>

        <div className="text-muted grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
          <p className="flex items-center gap-1.5">
            <Layers3 aria-hidden="true" size={14} strokeWidth={1.8} />
            {board.cardCount} カード
          </p>
          <p className="flex items-center gap-1.5">
            <Columns3 aria-hidden="true" size={14} strokeWidth={1.8} />
            {board.columns.length} カラム
          </p>
          <p className="flex items-center gap-1.5">
            <Users aria-hidden="true" size={14} strokeWidth={1.8} />
            {board.members.length} メンバー
          </p>
          <p className="flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" size={14} strokeWidth={1.8} />
            {board.updatedAt}
          </p>
        </div>

        <div className="border-border mt-auto flex items-center justify-between gap-3 border-t pt-4">
          <p className="text-muted text-xs font-medium">参加メンバー</p>
          <div
            aria-label={`${board.name} の参加メンバー`}
            className="flex shrink-0 -space-x-2"
          >
            {board.members.slice(0, visibleMemberCount).map((member) => (
              <Avatar key={member.name} member={member} />
            ))}
            {hiddenMemberCount > 0 ? (
              <span
                aria-label={`ほか${hiddenMemberCount}人`}
                className="border-surface bg-surface-muted text-surface-foreground grid size-8 place-items-center rounded-full border-2 text-xs font-semibold shadow-sm"
                role="img"
                title={`ほか${hiddenMemberCount}人`}
              >
                +{hiddenMemberCount}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
