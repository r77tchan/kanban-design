import {
  CalendarDays,
  Clock3,
  Columns3,
  Grip,
  Layers3,
  LogOut,
  Pin,
  Plus,
  Users,
} from "lucide-react";
import Image from "next/image";
import { ThemeSelector } from "./theme-selector";

type Board = {
  name: string;
  description: string;
  updatedAt: string;
  owner: string;
  themeColor: string;
  pinned?: boolean;
  isNew?: boolean;
  cardCount: number;
  columns: string[];
  members: Array<{
    name: string;
    initial: string;
    color: string;
  }>;
};

const currentUser = {
  name: "山田 太郎",
  initial: "山",
  color: "#0f766e",
};

const boards: Board[] = [
  {
    name: "プロダクト計画",
    description: "ロードマップ、仕様検討、リリース準備",
    updatedAt: "今日 10:24",
    owner: "Product",
    themeColor: "#0f766e",
    pinned: true,
    cardCount: 34,
    columns: ["Ideas", "Spec", "Build", "QA", "Launch"],
    members: [
      currentUser,
      { name: "佐藤 花", initial: "佐", color: "#7c3aed" },
      { name: "田中 誠", initial: "田", color: "#b45309" },
      { name: "Lee Chen", initial: "L", color: "#0e7490" },
      { name: "高橋 葵", initial: "高", color: "#be123c" },
      { name: "井上 蓮", initial: "井", color: "#4338ca" },
    ],
  },
  {
    name: "デザイン運用",
    description: "UI確認、文言調整、アクセシビリティ改善",
    updatedAt: "昨日 18:10",
    owner: "Design",
    themeColor: "#7c3aed",
    pinned: true,
    cardCount: 27,
    columns: ["Brief", "Wire", "Review", "Handoff"],
    members: [
      { name: "藤井 美咲", initial: "藤", color: "#c2410c" },
      { name: "中村 海", initial: "中", color: "#15803d" },
      { name: "Mia Park", initial: "M", color: "#a21caf" },
      { name: "小林 遥", initial: "小", color: "#0369a1" },
    ],
  },
  {
    name: "営業パイプライン",
    description: "提案準備、商談、契約確認、導入フォロー",
    updatedAt: "6月12日",
    owner: "Sales",
    themeColor: "#d97706",
    isNew: true,
    cardCount: 48,
    columns: ["Lead", "Meeting", "Proposal", "Contract", "Onboard"],
    members: [
      { name: "鈴木 航", initial: "鈴", color: "#b91c1c" },
      { name: "伊藤 真央", initial: "伊", color: "#047857" },
      { name: "Ken Ito", initial: "K", color: "#6d28d9" },
      { name: "渡辺 結", initial: "渡", color: "#a16207" },
      { name: "林 直人", initial: "林", color: "#0f766e" },
      { name: "阿部 凛", initial: "阿", color: "#be185d" },
      { name: "Rui Kim", initial: "R", color: "#1d4ed8" },
      { name: "森 悠", initial: "森", color: "#92400e" },
    ],
  },
  {
    name: "採用プロセス",
    description: "候補者対応、面談調整、評価、オファー管理",
    updatedAt: "6月10日",
    owner: "People",
    themeColor: "#e11d48",
    cardCount: 30,
    columns: ["応募", "面談", "評価", "内定"],
    members: [
      { name: "石川 玲", initial: "石", color: "#2563eb" },
      { name: "吉田 杏", initial: "吉", color: "#9333ea" },
      { name: "Chris Wong", initial: "C", color: "#0891b2" },
      { name: "長谷川 透", initial: "長", color: "#dc2626" },
      { name: "原 里奈", initial: "原", color: "#4d7c0f" },
    ],
  },
];

const pinnedBoards = boards.filter((board) => board.pinned);
const recentBoards = boards.filter((board) => !board.pinned);

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <header className="border-border bg-surface border-b">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="border-border grid size-10 shrink-0 place-items-center rounded-md border bg-white">
                <Image
                  alt=""
                  height={30}
                  src="/skym-logo.ico"
                  unoptimized
                  width={30}
                />
              </span>
              <div className="min-w-0">
                <p className="text-foreground truncate text-sm font-semibold">
                  SKYM Kanban
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <button
                aria-label={`${currentUser.name}のプロフィール`}
                className="border-border bg-surface-muted text-surface-foreground focus-visible:outline-focus hover:bg-surface hover:text-foreground flex h-9 cursor-pointer items-center gap-2 rounded-md border px-2.5 text-sm font-medium select-none focus-visible:outline-2 focus-visible:outline-offset-2"
                title="プロフィール"
                type="button"
              >
                <span
                  aria-hidden="true"
                  className="grid size-6 place-items-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: currentUser.color }}
                >
                  {currentUser.initial}
                </span>
                {currentUser.name}
              </button>
              <ThemeSelector />
              <button
                className="border-border bg-surface-muted text-surface-foreground focus-visible:outline-focus hover:bg-surface hover:text-foreground flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border px-2.5 text-sm font-medium select-none focus-visible:outline-2 focus-visible:outline-offset-2"
                type="button"
              >
                <LogOut aria-hidden="true" size={16} strokeWidth={1.8} />
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h1 className="text-foreground text-3xl font-bold tracking-normal sm:text-4xl">
              ボード一覧
            </h1>
          </div>

          <button
            className="bg-brand text-brand-foreground focus-visible:outline-focus flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold select-none hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto"
            type="button"
          >
            <Plus aria-hidden="true" size={17} strokeWidth={1.8} />
            新規ボード
          </button>
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

function BoardCard({
  board,
  isPinned = false,
}: {
  board: Board;
  isPinned?: boolean;
}) {
  return (
    <article
      aria-label={`${board.name} のボードカード`}
      className="board-card border-border bg-surface text-surface-foreground rounded-lg border p-5 shadow-sm select-none"
      tabIndex={0}
    >
      <div className="flex min-h-full flex-col gap-5">
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
              <p className="text-muted text-xs font-medium">
                所有チーム{" "}
                <span className="text-surface-foreground">{board.owner}</span>
              </p>
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
              aria-label="並び替え"
              className="border-border bg-surface text-muted focus-visible:outline-focus hover:border-border-strong hover:bg-surface-muted hover:text-foreground grid size-7 shrink-0 cursor-grab place-items-center rounded border select-none focus-visible:outline-2 focus-visible:outline-offset-2 active:cursor-grabbing"
              tabIndex={-1}
              title="ドラッグして並び替え"
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
            {board.members.slice(0, 4).map((member) => (
              <span
                aria-label={member.name}
                className="border-surface grid size-8 place-items-center rounded-full border-2 text-xs font-semibold text-white shadow-sm"
                key={member.name}
                role="img"
                style={{ backgroundColor: member.color }}
                title={member.name}
              >
                {member.initial}
              </span>
            ))}
            {board.members.length > 4 ? (
              <span
                aria-label={`ほか${board.members.length - 4}人`}
                className="border-surface bg-surface-muted text-surface-foreground grid size-8 place-items-center rounded-full border-2 text-xs font-semibold shadow-sm"
                role="img"
                title={`ほか${board.members.length - 4}人`}
              >
                +{board.members.length - 4}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
