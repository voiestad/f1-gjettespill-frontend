import { useEffect, createContext, useState } from "react";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState(localStorage.getItem("theme"));
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
