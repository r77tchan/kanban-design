"use client";

import {
  AlignLeft,
  Check,
  LayoutTemplate,
  Palette,
  Plus,
  Type,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

type NewBoardDialogLauncherProps = {
  owner: {
    name: string;
    initial: string;
    color: string;
  };
};

const focusableDialogElementSelector = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

const boardTemplateOptions = [
  {
    id: "standard",
    name: "標準",
    columns: ["Ideas", "Spec", "Build", "QA", "Launch"],
  },
  {
    id: "development",
    name: "開発",
    columns: ["Backlog", "Todo", "Progress", "Review", "Done"],
  },
  {
    id: "sales",
    name: "営業",
    columns: ["Lead", "Meeting", "Proposal", "Contract", "Onboard"],
  },
  {
    id: "empty",
    name: "空のボード",
    columns: [],
  },
] as const;

const themeColorOptions = [
  { name: "Teal", value: "#0f766e" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Amber", value: "#d97706" },
  { name: "Rose", value: "#e11d48" },
  { name: "Blue", value: "#2563eb" },
  { name: "Cyan", value: "#0e7490" },
] as const;

type BoardTemplateId = (typeof boardTemplateOptions)[number]["id"];
type ThemeColorValue = (typeof themeColorOptions)[number]["value"];

function getFocusableDialogElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableDialogElementSelector),
  ).filter(
    (element) =>
      element.getAttribute("aria-hidden") !== "true" &&
      element.getClientRects().length > 0,
  );
}

export function NewBoardDialogLauncher({ owner }: NewBoardDialogLauncherProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => {
    setIsDialogOpen(false);
    window.requestAnimationFrame(() => {
      triggerRef.current?.focus({ preventScroll: true });
    });
  }, []);

  return (
    <>
      <button
        aria-controls="new-board-dialog"
        aria-expanded={isDialogOpen}
        className="bg-brand text-brand-foreground focus-visible:outline-focus flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold select-none hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto"
        onClick={() => setIsDialogOpen(true)}
        ref={triggerRef}
        type="button"
      >
        <Plus aria-hidden="true" size={17} strokeWidth={1.8} />
        新規ボード
      </button>

      {isDialogOpen ? (
        <NewBoardDialog onClose={handleClose} owner={owner} />
      ) : null}
    </>
  );
}

function NewBoardDialog({
  onClose,
  owner,
}: {
  onClose: () => void;
  owner: NewBoardDialogLauncherProps["owner"];
}) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<BoardTemplateId>("standard");
  const [selectedThemeColor, setSelectedThemeColor] = useState<ThemeColorValue>(
    themeColorOptions[0].value,
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

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

    window.requestAnimationFrame(() => {
      nameInputRef.current?.focus({ preventScroll: true });
    });

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

    const focusableElements = getFocusableDialogElements(panel);

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onClose();
  };

  return (
    <div
      aria-labelledby="new-board-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6 select-none"
      id="new-board-dialog"
      onKeyDown={handleKeyDown}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          event.preventDefault();
        }
      }}
      role="dialog"
    >
      <div
        className="border-border bg-surface text-surface-foreground flex max-h-[calc(100dvh-3rem)] w-full max-w-3xl flex-col overflow-hidden rounded-lg border shadow-xl select-none"
        ref={panelRef}
        tabIndex={-1}
      >
        <div className="border-border flex items-start justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            <h2
              className="text-foreground text-lg font-semibold"
              id="new-board-title"
            >
              新規ボード
            </h2>
            <p className="text-muted mt-1 text-sm">
              基本情報と初期設定を決めて作成します
            </p>
          </div>
          <button
            aria-label="新規ボードを閉じる"
            className="text-muted hover:bg-surface-muted hover:text-foreground focus-visible:outline-focus grid size-8 shrink-0 cursor-pointer place-items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={18} strokeWidth={1.8} />
          </button>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="grid min-h-0 gap-6 overflow-y-auto px-5 py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <section
                aria-labelledby="new-board-basic-title"
                className="space-y-4"
              >
                <h3
                  className="text-foreground text-sm font-semibold"
                  id="new-board-basic-title"
                >
                  基本情報
                </h3>

                <label className="space-y-2">
                  <span className="text-foreground flex items-center gap-1.5 text-sm font-semibold">
                    <Type aria-hidden="true" size={15} strokeWidth={1.8} />
                    ボード名
                  </span>
                  <input
                    className="new-board-text-input border-border bg-surface text-foreground focus-visible:outline-focus h-10 w-full rounded-md border px-3 text-sm select-text focus-visible:outline-2 focus-visible:outline-offset-2"
                    placeholder="例: プロダクト計画"
                    ref={nameInputRef}
                    required
                    type="text"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-foreground flex items-center gap-1.5 text-sm font-semibold">
                    <AlignLeft aria-hidden="true" size={15} strokeWidth={1.8} />
                    説明
                  </span>
                  <textarea
                    className="new-board-text-input border-border bg-surface text-foreground focus-visible:outline-focus min-h-24 w-full resize-none rounded-md border px-3 py-2 text-sm leading-6 select-text focus-visible:outline-2 focus-visible:outline-offset-2"
                    placeholder="例: ロードマップ、仕様検討、リリース準備"
                  />
                </label>
              </section>

              <section
                aria-labelledby="new-board-color-title"
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Palette
                    aria-hidden="true"
                    className="text-muted"
                    size={16}
                    strokeWidth={1.8}
                  />
                  <h3
                    className="text-foreground text-sm font-semibold"
                    id="new-board-color-title"
                  >
                    テーマカラー
                  </h3>
                </div>

                <fieldset className="flex flex-wrap gap-2">
                  <legend className="sr-only">テーマカラーを選択</legend>
                  {themeColorOptions.map((color) => (
                    <label
                      aria-label={`${color.name}を選択`}
                      className={colorSwatchClass(
                        selectedThemeColor === color.value,
                      )}
                      key={color.value}
                      title={color.name}
                    >
                      <input
                        checked={selectedThemeColor === color.value}
                        className="sr-only"
                        name="board-theme-color"
                        onChange={() => setSelectedThemeColor(color.value)}
                        type="radio"
                        value={color.value}
                      />
                      <span
                        aria-hidden="true"
                        className="grid size-7 place-items-center rounded-full"
                        style={{ backgroundColor: color.value }}
                      >
                        {selectedThemeColor === color.value ? (
                          <Check
                            className="text-white"
                            size={15}
                            strokeWidth={2.2}
                          />
                        ) : null}
                      </span>
                    </label>
                  ))}
                </fieldset>
              </section>

              <section
                aria-labelledby="new-board-members-title"
                className="border-border bg-surface-muted rounded-lg border p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h3
                      className="text-foreground flex items-center gap-2 text-sm font-semibold"
                      id="new-board-members-title"
                    >
                      <Users aria-hidden="true" size={16} strokeWidth={1.8} />
                      メンバー
                    </h3>
                    <div className="mt-3 flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold text-white"
                        style={{ backgroundColor: owner.color }}
                      >
                        {owner.initial}
                      </span>
                      <div className="min-w-0">
                        <p className="text-foreground truncate text-sm font-semibold">
                          {owner.name}
                        </p>
                        <p className="text-muted text-xs font-medium">所有者</p>
                      </div>
                    </div>
                  </div>
                  <button
                    className="border-border bg-surface text-surface-foreground hover:bg-surface-muted focus-visible:outline-focus flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
                    type="button"
                  >
                    <UserPlus aria-hidden="true" size={16} strokeWidth={1.8} />
                    メンバー追加
                  </button>
                </div>
              </section>
            </div>

            <section
              aria-labelledby="new-board-template-title"
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <LayoutTemplate
                  aria-hidden="true"
                  className="text-muted"
                  size={16}
                  strokeWidth={1.8}
                />
                <h3
                  className="text-foreground text-sm font-semibold"
                  id="new-board-template-title"
                >
                  初期カラム
                </h3>
              </div>

              <fieldset className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                <legend className="sr-only">初期カラムを選択</legend>
                {boardTemplateOptions.map((template) => (
                  <label
                    className={templateOptionClass(
                      selectedTemplate === template.id,
                    )}
                    key={template.id}
                  >
                    <input
                      checked={selectedTemplate === template.id}
                      className="sr-only"
                      name="board-template"
                      onChange={() => setSelectedTemplate(template.id)}
                      type="radio"
                      value={template.id}
                    />
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-foreground font-semibold">
                        {template.name}
                      </span>
                      {selectedTemplate === template.id ? (
                        <span className="bg-brand text-brand-foreground grid size-5 place-items-center rounded-full">
                          <Check
                            aria-hidden="true"
                            size={13}
                            strokeWidth={2.2}
                          />
                        </span>
                      ) : null}
                    </span>
                    <span className="text-muted mt-2 flex flex-wrap gap-1 text-xs font-medium">
                      {template.columns.length > 0
                        ? template.columns.map((column) => (
                            <span
                              className="bg-surface rounded border border-transparent px-1.5 py-0.5"
                              key={column}
                            >
                              {column}
                            </span>
                          ))
                        : "カラムなし"}
                    </span>
                  </label>
                ))}
              </fieldset>
            </section>
          </div>

          <div className="border-border flex flex-col-reverse gap-2 border-t px-5 py-4 sm:flex-row sm:justify-end">
            <button
              className="border-border bg-surface-muted text-surface-foreground hover:bg-surface focus-visible:outline-focus flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
              onClick={onClose}
              type="button"
            >
              キャンセル
            </button>
            <button
              className="bg-brand text-brand-foreground focus-visible:outline-focus flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
              type="submit"
            >
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function templateOptionClass(isSelected: boolean) {
  return isSelected
    ? "border-brand bg-brand-soft text-brand-soft-foreground focus-within:outline-focus cursor-pointer rounded-md border p-3 select-none focus-within:outline-2 focus-within:outline-offset-2"
    : "border-border bg-surface-muted text-surface-foreground hover:border-border-strong hover:bg-surface focus-within:outline-focus cursor-pointer rounded-md border p-3 select-none focus-within:outline-2 focus-within:outline-offset-2";
}

function colorSwatchClass(isSelected: boolean) {
  return isSelected
    ? "border-brand bg-brand-soft focus-within:outline-focus grid size-10 cursor-pointer place-items-center rounded-md border select-none focus-within:outline-2 focus-within:outline-offset-2"
    : "border-border bg-surface-muted hover:border-border-strong hover:bg-surface focus-within:outline-focus grid size-10 cursor-pointer place-items-center rounded-md border select-none focus-within:outline-2 focus-within:outline-offset-2";
}
