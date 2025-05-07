import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

const ThemeToggler = () => {
    const [theme, setTheme] = useState(
        typeof window !== "undefined"
            ? localStorage.getItem("theme") || "light"
            : "light"
    );

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <Button
            onClick={toggleTheme}
            size="icon"
            className="bg-transparent hover:bg-transparent"
        >
            {theme === "light" ? (
                <Icon
                    icon="solar:moon-bold"
                    className="w-5 h-5 text-black dark:text-white"
                />
            ) : (
                <Icon
                    icon="solar:sun-bold"
                    className="w-6 h-6 text-black dark:text-white"
                />
            )}
        </Button>
    );
};

export default ThemeToggler;
