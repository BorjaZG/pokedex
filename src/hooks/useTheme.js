import { useEffect, useState } from "react";

const STORAGE_KEY = "theme"; // "light" | "dark"

export function useTheme() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved === "dark" ? "dark" : "light";
    });

    useEffect(() => {
        // Guardar elección
        localStorage.setItem(STORAGE_KEY, theme);

        // Aplicar a todo el documento (CSS global)
        document.documentElement.dataset.theme = theme; // <html data-theme="dark">
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return { theme, toggleTheme, setTheme };
}