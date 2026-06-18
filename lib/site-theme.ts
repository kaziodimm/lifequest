import { defaultTreeThemeId, treeThemes, type TreeThemeId } from "@/lib/tree-themes";

export const siteThemeStorageKey = "habidoo-tree-theme";
export const siteThemeEvent = "habidoo-theme-change";

export function isSiteTheme(value: string | null): value is TreeThemeId {
  return Boolean(value && treeThemes.some((theme) => theme.id === value));
}

export function readSiteTheme(): TreeThemeId {
  if (typeof window === "undefined") return defaultTreeThemeId;
  const value = window.localStorage.getItem(siteThemeStorageKey);
  return isSiteTheme(value) ? value : defaultTreeThemeId;
}

export function applySiteTheme(themeId: TreeThemeId, persist = true) {
  document.documentElement.dataset.siteTheme = themeId;
  if (persist) window.localStorage.setItem(siteThemeStorageKey, themeId);
  window.dispatchEvent(new CustomEvent<TreeThemeId>(siteThemeEvent, { detail: themeId }));
}
