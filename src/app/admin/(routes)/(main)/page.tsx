import { redirect } from "next/navigation"

import { Paths } from "~/lib/constants"

export default function AdminPage() {
  return redirect(Paths.Admin.Dashboard)
}
