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
    <fieldset className="border-border bg-surface text-surface-foreground flex gap-2 rounded-lg border p-2">
      <legend className="text-foreground px-2">テーマ</legend>
      {options.map((option) => {
        const Icon = option.Icon;

        return (
          <label
            className="focus-within:outline-focus has-checked:bg-accent has-checked:text-accent-foreground flex min-w-22 cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 focus-within:outline-2 focus-within:outline-offset-2"
            key={option.value}
          >
            <input
              className="accent-accent"
              defaultChecked={option.value === DEFAULT_THEME}
              name="theme"
              type="radio"
              value={option.value}
            />
            <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
            {option.label}
          </label>
        );
      })}
    </fieldset>
  );
}
