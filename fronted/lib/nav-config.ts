import {
    LayoutDashboard,
    TrendingUp,
    CreditCard,
    MapPin,
    DollarSign,
    BarChart3,
    Users,
    BookOpen,
} from "lucide-react"

export const navItems = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        description: "Overview",
    },
    {
        title: "Trips Over Time",
        href: "/trips-over-time",
        icon: TrendingUp,
        description: "Trends",
    },
    {
        title: "Payment Stats",
        href: "/payment-stats",
        icon: CreditCard,
        description: "Payments",
    },
    {
        title: "Top Zones",
        href: "/top-zones",
        icon: MapPin,
        description: "Locations",
    },
    {
        title: "Tip Analysis",
        href: "/tip-analysis",
        icon: DollarSign,
        description: "Tips",
    },
    {
        title: "Distance Distribution",
        href: "/distance-distribution",
        icon: BarChart3,
        description: "Distribution",
    },
]

export const footerItems = [
    {
        title: "Team Info",
        href: "/team",
        icon: Users,
        description: "About us",
    },
    {
        title: "Documentation",
        href: "/docs",
        icon: BookOpen,
        description: "Docs",
    },
]
