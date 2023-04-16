export const setTheme = (isDark = true) => {
  localStorage.setItem("isDarkMode", JSON.stringify(isDark));
};

export const getTheme = () => {
  return JSON.parse(localStorage.getItem("isDarkMode"));
};

export const configureTheme = (theme) => {
  const darkThemeInSession = getTheme();
  theme.global.name.value = darkThemeInSession ? "dark" : "light";
  //   document.documentElement.style.setProperty("--your-variable", "#YOURCOLOR");
};

export const sleeper = async ({ duration }) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, duration)
  );
};
