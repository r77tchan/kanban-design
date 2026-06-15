import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ThemeSelector } from "./theme-selector";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const currentUser = {
  name: "山田 太郎",
  initial: "山",
  color: "#0f766e",
};

export function Header() {
  return (
    <header className="border-border bg-surface border-b">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Link
            className="hover:bg-surface-muted focus-visible:outline-focus flex min-w-0 items-center gap-3 rounded-md px-2 py-1.5 select-none focus-visible:outline-2 focus-visible:outline-offset-2"
            href="/"
          >
            <span className="border-border grid size-10 shrink-0 place-items-center rounded-md border bg-white">
              <Image
                alt=""
                height={30}
                src={`${basePath}/skym-logo.ico`}
                unoptimized
                width={30}
              />
            </span>
            <div className="min-w-0">
              <p className="text-foreground truncate text-sm font-semibold">
                SKYM Kanban
              </p>
            </div>
          </Link>

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
  );
}
