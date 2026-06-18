// src/config/adminMenu.js
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  BarChart3, Tag, Ticket, Star, UserCog, Settings,
} from "lucide-react";

export const MENU_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    roles: ["admin", "staff", "manager"],
    end: true,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: Package,
    roles: ["admin", "manager"],
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: ShoppingCart,
    roles: ["admin", "staff", "manager"],
  },
  {
    id: "customers",
    label: "Customers",
    path: "/admin/customers",
    icon: Users,
    roles: ["admin", "manager"],
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
    roles: ["admin"],
  },
  {
    id: "categories",
    label: "Categories",
    path: "/admin/categories",
    icon: Tag,
    roles: ["admin", "manager"],
  },
  {
    id: "coupons",
    label: "Coupons",
    path: "/admin/coupons",
    icon: Ticket,
    roles: ["admin"],
  },
  {
    id: "reviews",
    label: "Reviews",
    path: "/admin/reviews",
    icon: Star,
    roles: ["admin", "staff", "manager"],
  },
  {
    id: "staff",
    label: "Staff",
    path: "/admin/staff",
    icon: UserCog,
    roles: ["admin"],
  },
  {
    id: "settings",
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
    roles: ["admin"],
  },
];