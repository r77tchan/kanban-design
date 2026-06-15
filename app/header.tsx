"use client";

import { Camera, KeyRound, LogOut, Mail, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ThemeSelector } from "./theme-selector";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const currentUser = {
  name: "山田 太郎",
  initial: "山",
  color: "#0f766e",
  email: "taro.yamada@example.com",
  passwordUpdatedAt: "2026/06/01",
};

const focusableModalElementSelector = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function getFocusableModalElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableModalElementSelector),
  ).filter(
    (element) =>
      element.getAttribute("aria-hidden") !== "true" &&
      element.getClientRects().length > 0,
  );
}

export function Header() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const handleProfileModalClose = useCallback(() => {
    setIsProfileModalOpen(false);
    window.requestAnimationFrame(() => {
      profileButtonRef.current?.focus({ preventScroll: true });
    });
  }, []);

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
              aria-controls="profile-settings-dialog"
              aria-expanded={isProfileModalOpen}
              aria-label={`${currentUser.name}のプロフィール`}
              className="border-border bg-surface-muted text-surface-foreground focus-visible:outline-focus hover:bg-surface hover:text-foreground flex h-9 cursor-pointer items-center gap-2 rounded-md border px-2.5 text-sm font-medium select-none focus-visible:outline-2 focus-visible:outline-offset-2"
              onClick={() => setIsProfileModalOpen(true)}
              ref={profileButtonRef}
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

      {isProfileModalOpen ? (
        <ProfileSettingsModal onClose={handleProfileModalClose} />
      ) : null}
    </header>
  );
}

function ProfileSettingsModal({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollY = window.scrollY;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousBodyOverflow = document.body.style.overflow;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const firstFocusableElement = panel
      ? getFocusableModalElements(panel)[0]
      : null;

    firstFocusableElement?.focus({ preventScroll: true });

    const handleDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener("keydown", handleDocumentKeyDown);
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      document.body.style.overflow = previousBodyOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [onClose]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") {
      return;
    }

    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    const focusableElements = getFocusableModalElements(panel);

    if (focusableElements.length === 0) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;
    const activeElementIndex = focusableElements.findIndex(
      (element) => element === activeElement,
    );

    event.preventDefault();

    if (event.shiftKey) {
      if (
        activeElement === firstFocusableElement ||
        activeElement === panel ||
        !panel.contains(activeElement) ||
        activeElementIndex <= 0
      ) {
        lastFocusableElement.focus();
        return;
      }

      focusableElements[activeElementIndex - 1].focus();
      return;
    }

    if (
      activeElement === lastFocusableElement ||
      activeElement === panel ||
      !panel.contains(activeElement) ||
      activeElementIndex === -1 ||
      activeElementIndex >= focusableElements.length - 1
    ) {
      firstFocusableElement.focus();
      return;
    }

    focusableElements[activeElementIndex + 1].focus();
  };

  return (
    <div
      aria-labelledby="profile-settings-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6 select-none"
      id="profile-settings-dialog"
      onKeyDown={handleKeyDown}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          event.preventDefault();
        }
      }}
      role="dialog"
    >
      <div
        className="border-border bg-surface text-surface-foreground max-h-[calc(100dvh-3rem)] w-full max-w-xl overflow-y-auto rounded-lg border shadow-xl select-none"
        ref={panelRef}
        tabIndex={-1}
      >
        <div className="border-border flex items-start justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            <h2
              className="text-foreground text-lg font-semibold"
              id="profile-settings-title"
            >
              プロフィール設定
            </h2>
            <p className="text-muted mt-1 text-sm">
              アカウントの表示情報を確認、編集できます
            </p>
          </div>
          <button
            aria-label="プロフィール設定を閉じる"
            className="text-muted hover:bg-surface-muted hover:text-foreground focus-visible:outline-focus grid size-8 shrink-0 cursor-pointer place-items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={18} strokeWidth={1.8} />
          </button>
        </div>

        <div className="space-y-6 px-5 py-5">
          <section className="space-y-3" aria-labelledby="profile-image-title">
            <h3
              className="text-foreground text-sm font-semibold"
              id="profile-image-title"
            >
              プロフィール画像
            </h3>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span
                aria-hidden="true"
                className="grid size-16 shrink-0 place-items-center rounded-full text-2xl font-semibold text-white"
                style={{ backgroundColor: currentUser.color }}
              >
                {currentUser.initial}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  className="border-border bg-surface-muted text-surface-foreground hover:bg-surface focus-visible:outline-focus flex h-10 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
                  type="button"
                >
                  <Camera aria-hidden="true" size={16} strokeWidth={1.8} />
                  画像を変更
                </button>
                <button
                  className="border-border text-muted hover:bg-surface-muted hover:text-foreground focus-visible:outline-focus h-10 cursor-pointer rounded-md border px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
                  type="button"
                >
                  削除
                </button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-foreground flex items-center gap-1.5 text-sm font-semibold">
                <User aria-hidden="true" size={15} strokeWidth={1.8} />
                名前
              </span>
              <input
                className="border-border bg-surface text-foreground focus-visible:outline-focus h-10 w-full rounded-md border px-3 text-sm select-text focus-visible:outline-2 focus-visible:outline-offset-2"
                defaultValue={currentUser.name}
                type="text"
              />
            </label>

            <label className="space-y-2">
              <span className="text-foreground flex items-center gap-1.5 text-sm font-semibold">
                <Mail aria-hidden="true" size={15} strokeWidth={1.8} />
                メールアドレス
              </span>
              <input
                className="border-border bg-surface-muted text-surface-foreground focus-visible:outline-focus h-10 w-full rounded-md border px-3 text-sm select-text focus-visible:outline-2 focus-visible:outline-offset-2"
                defaultValue={currentUser.email}
                readOnly
                type="email"
              />
            </label>
          </section>

          <section
            aria-labelledby="profile-security-title"
            className="border-border bg-surface-muted rounded-lg border p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h3
                  className="text-foreground flex items-center gap-2 text-sm font-semibold"
                  id="profile-security-title"
                >
                  <KeyRound aria-hidden="true" size={16} strokeWidth={1.8} />
                  パスワード
                </h3>
                <p className="text-muted mt-1 text-sm">
                  最終更新: {currentUser.passwordUpdatedAt}
                </p>
              </div>
              <button
                className="border-border bg-surface text-surface-foreground hover:bg-surface-muted focus-visible:outline-focus flex h-10 cursor-pointer items-center justify-center rounded-md border px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
                type="button"
              >
                パスワードを変更
              </button>
            </div>
          </section>
        </div>

        <div className="border-border flex flex-col-reverse gap-2 border-t px-5 py-4 sm:flex-row sm:justify-end">
          <button
            className="border-border bg-surface-muted text-surface-foreground hover:bg-surface focus-visible:outline-focus flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={onClose}
            type="button"
          >
            <span>キャンセル</span>
            <kbd className="border-border bg-surface text-muted rounded border px-1.5 py-0.5 text-[11px] leading-none font-semibold">
              Esc
            </kbd>
          </button>
          <button
            className="bg-brand text-brand-foreground focus-visible:outline-focus flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={onClose}
            type="button"
          >
            <span>保存</span>
            <kbd className="border-brand-foreground/40 bg-brand-foreground/15 rounded border px-1.5 py-0.5 text-[11px] leading-none font-semibold">
              ⌘↵
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
