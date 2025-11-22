import React, { useState, useEffect } from "react";

const ThemeSelector = () => {
    const [theme, updateTheme] = useState("light");

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved) {
            handleChange(saved);
        }
    }, []);

    const toggleTheme = () => {
        theme === "light" ? handleChange("dark") : handleChange("light");
    }

    const handleChange = (value) => {
        updateTheme(value);
        document.documentElement.setAttribute("theme", value);
        localStorage.setItem("theme", value);
    }

    return (
        <div id="themeSwitch" onMouseOver={toggleTheme}>
            {theme === "light" ? "💡" : "🕯️"}
        </div>
    )
}

export default ThemeSelector;