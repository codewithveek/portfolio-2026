/** localStorage key for the light-theme choice. No key means the default dark theme. */
export const themeStorageKey = "veek-theme";

/**
 * Runs in <head> before first paint so a stored choice never flashes the other theme. Kept
 * static so the Worker can allow it in the CSP by hash, which keeps edge-cached HTML identical
 * for every visitor. Without JavaScript the site is always dark.
 */
export const themeScript = `(function(){try{var theme=localStorage.getItem("${themeStorageKey}");if(theme==="light"){document.documentElement.setAttribute("data-theme","light")}}catch(error){}})();`;
