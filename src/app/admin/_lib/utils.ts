import { Icons, type IconProps } from "~/components/icons"

interface AdminNavLinks {
  title: string
  icon: React.FunctionComponent<IconProps>
  path: string
}

export const adminNavLinks: AdminNavLinks[] = [
  {
    title: "Dashboard",
    icon: Icons.ganttChartSquare,
    path: "/admin/dashboard",
  },
  {
    title: "Orders",
    icon: Icons.cart,
    path: "/admin/orders",
  },
  {
    title: "Products",
    icon: Icons.package,
    path: "/admin/products",
  },
  {
    title: "Users",
    icon: Icons.user,
    path: "/admin/users",
  },
  {
    title: "Storefront",
    icon: Icons.store,
    path: "/",
  },
  {
    title: "Settings",
    icon: Icons.settings,
    path: "/admin/settings",
  },
]
