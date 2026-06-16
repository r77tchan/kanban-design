import { Clock3, Pin } from "lucide-react";
import { BoardCard } from "@/app/_components/board-card";
import { boardSummaries } from "@/app/_lib/kanban-data";
import { currentUser } from "@/app/_lib/users";
import { NewBoardDialogLauncher } from "./new-board-dialog";

const pinnedBoards = boardSummaries.filter((board) => board.pinned);
const recentBoards = boardSummaries.filter((board) => !board.pinned);

export default function Home() {
  return (
    <div className="bg-background flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h1 className="text-foreground text-3xl font-bold tracking-normal sm:text-4xl">
              ボード一覧
            </h1>
          </div>

          <NewBoardDialogLauncher owner={currentUser} />
        </section>

        <section aria-labelledby="pinned-boards-title" className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Pin
                aria-hidden="true"
                className="text-muted shrink-0"
                size={18}
                strokeWidth={1.8}
              />
              <h2
                className="text-foreground text-lg font-semibold"
                id="pinned-boards-title"
              >
                固定したボード
              </h2>
            </div>
            <span className="text-muted text-xs font-medium">自分の並び順</span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {pinnedBoards.map((board) => (
              <BoardCard board={board} isPinned key={board.name} />
            ))}
          </div>
        </section>

        <section aria-labelledby="recent-boards-title" className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Clock3
                aria-hidden="true"
                className="text-muted shrink-0"
                size={18}
                strokeWidth={1.8}
              />
              <h2
                className="text-foreground text-lg font-semibold"
                id="recent-boards-title"
              >
                最近更新されたボード
              </h2>
            </div>
            <span className="text-muted text-xs font-medium">最終更新順</span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {recentBoards.map((board) => (
              <BoardCard board={board} key={board.name} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
