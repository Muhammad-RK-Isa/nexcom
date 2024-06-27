import { Icons, type IconProps } from "~/components/icons"

interface AdminNavLinks {
  title: string
  icon: React.FunctionComponent<IconProps>
  path: string
  active: boolean
}

export const adminNavLinks: AdminNavLinks[] = [
  {
    title: "Dashboard",
    icon: Icons.ganttChartSquare,
    path: "/admin/dashboard",
    active: true,
  },
  {
    title: "Orders",
    icon: Icons.cart,
    path: "/admin/orders",
    active: true,
  },
  {
    title: "Products",
    icon: Icons.package,
    path: "/admin/products",
    active: true,
  },
  {
    title: "Users",
    icon: Icons.user,
    path: "/admin/users",
    active: false,
  },
  {
    title: "Storefront",
    icon: Icons.store,
    path: "/",
    active: true,
  },
]
