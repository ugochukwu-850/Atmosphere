/**
 * Colour theme. The preference ("light" | "dark" | "system") lives in
 * localStorage; <html data-theme> always holds the resolved "light" | "dark".
 * Light is the default, matching the Figma frames.
 */
export const THEME_STORAGE_KEY = "ams-theme";

export const THEME_PREFERENCES = ["light", "dark", "system"] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export const DEFAULT_THEME: ThemePreference = "light";

export function isThemePreference(value: unknown): value is ThemePreference {
  return (
    typeof value === "string" &&
    (THEME_PREFERENCES as readonly string[]).includes(value)
  );
}

export function resolveTheme(preference: ThemePreference): "light" | "dark" {
  if (preference !== "system") return preference;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(preference: ThemePreference) {
  document.documentElement.dataset.theme = resolveTheme(preference);
}

/**
 * Inline <head> script: sets data-theme before first paint so a stored dark
 * preference never flashes light. Keep in sync with the helpers above.
 */
export const themeScript = `(function(){try{var p=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(p!=="dark"&&p!=="system")p=${JSON.stringify(
  DEFAULT_THEME,
)};var d=p==="dark"||(p==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}})()`;
