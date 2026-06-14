import { Monitor, Moon, Sun } from "lucide-react";
import { DEFAULT_THEME, type Theme } from "./theme";

const options = [
  { label: "ライト", value: "light", Icon: Sun },
  { label: "自動", value: "auto", Icon: Monitor },
  { label: "ダーク", value: "dark", Icon: Moon },
] satisfies Array<{
  label: string;
  value: Theme;
  Icon: typeof Sun;
}>;

export function ThemeSelector() {
  return (
    <fieldset className="border-border bg-surface-muted text-muted flex gap-px rounded-md border p-px select-none">
      <legend className="sr-only">テーマ</legend>
      {options.map((option) => {
        const Icon = option.Icon;

        return (
          <label
            className="focus-within:outline-focus has-checked:bg-brand has-checked:text-brand-foreground grid size-8 cursor-pointer place-items-center rounded select-none focus-within:outline-2 focus-within:outline-offset-2"
            key={option.value}
            title={option.label}
          >
            <input
              aria-label={option.label}
              className="sr-only"
              defaultChecked={option.value === DEFAULT_THEME}
              name="theme"
              type="radio"
              value={option.value}
            />
            <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
          </label>
        );
      })}
    </fieldset>
  );
}
