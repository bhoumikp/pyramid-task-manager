"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("light");

	useEffect(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("theme") as Theme | null;
			if (saved === "dark" || saved === "light") {
				setThemeState(saved);
				if (saved === "dark") {
					document.documentElement.classList.add("dark");
				} else {
					document.documentElement.classList.remove("dark");
				}
			} else if (document.documentElement.classList.contains("dark")) {
				setThemeState("dark");
			}
		}
	}, []);

	const setTheme = (newTheme: Theme) => {
		setThemeState(newTheme);
		if (typeof window !== "undefined") {
			localStorage.setItem("theme", newTheme);
			if (newTheme === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		}
	};

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		return {
			theme: "light" as Theme,
			setTheme: () => {},
		};
	}
	return context;
}