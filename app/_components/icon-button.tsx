import type { ReactNode } from "react";

export function IconButton({
  children,
  danger = false,
  label,
  small = false,
}: {
  children: ReactNode;
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
