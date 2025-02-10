import { Home, Settings, Table } from "lucide-react";

export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "Dashboard",
                icon: Home,
                path: "/",
            },
        ],
    },
    {
        title: "Quiz",
        links: [
            {
                label: "Daftar Quiz",
                icon: Table,
                path: "/quiz",
            },
        ],
    },
    {
        title: "Results",
        links: [
            {
                label: "Daftar Results",
                icon: Table,
                path: "/results",
            },
        ],
    },

];


