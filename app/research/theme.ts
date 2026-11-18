// The research pages follow the tools' Light, Dark or Device choice (padel-coach-src src/theme/themeChoice.js): the
// same pc_theme key on this site, stored as JSON, Light by default. Run before the page draws; [data-research] on the
// page and data-theme on <html> turn on the dark tokens (globals.css). Every other public page stays as it is.
export const THEME_KEY = 'pc_theme'
export const CHOICES = ['device', 'light', 'dark']
export const DEFAULT_CHOICE = 'light'

export const resolveTheme = (choice: unknown, deviceDark: boolean): 'light' | 'dark' => {
  const c = typeof choice === 'string' && CHOICES.includes(choice) ? choice : DEFAULT_CHOICE
  return c === 'dark' || (c === 'device' && deviceDark) ? 'dark' : 'light'
}

export const THEME_BOOT =
  `(function(){var c="${DEFAULT_CHOICE}";try{var v=JSON.parse(localStorage.getItem("${THEME_KEY}"));` +
  `if(${JSON.stringify(CHOICES)}.indexOf(v)>=0)c=v}catch(e){}` +
  `var d=c==="dark"||(c==="device"&&window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches);` +
  `var t=d?"dark":"light";document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t})();`
