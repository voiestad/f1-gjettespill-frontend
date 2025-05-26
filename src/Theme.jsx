import { useEffect, createContext, useState } from "react";

const ThemeContext = createContext();

const getTheme = () => {
	const theme = localStorage.getItem("theme");
	if (!theme) {
		const isUsingLightTheme = window.matchMedia("(prefers-color-scheme: light)");
		const preferredTheme = isUsingLightTheme.matches ? "light" : "dark";
		localStorage.setItem("theme", preferredTheme);
		return preferredTheme;
	} else {
		return theme;
	}
};

const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState(getTheme);
	const themes = ["light", "dark", "oled"];
	function toggleTheme() {
		const themeIndex = (themes.indexOf(theme) + 1) % themes.length;
		setTheme(themes[themeIndex]);
	};

	useEffect(() => {
		const refreshTheme = () => {
			localStorage.setItem("theme", theme);
			document.documentElement.setAttribute('data-theme', theme);
		};

		refreshTheme();
	}, [theme]);

	return (
		<ThemeContext.Provider
			value={{
				theme,
				setTheme,
				toggleTheme,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
};

export { ThemeContext, ThemeProvider };
