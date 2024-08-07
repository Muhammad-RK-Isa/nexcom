import type { TableProduct } from "~/types"
import { productStatuses } from "~/lib/validations/product"
import { Icons } from "~/components/icons"

/**
 * Returns the appropriate status icon based on the provided status.
 * @param status - The status of the task.
 * @returns A React component representing the status icon.
 */
export function getStatusIcon(status: TableProduct["status"]) {
  const statusIcons = {
    [productStatuses.Values.active]: Icons.checkCircle,
    [productStatuses.Values.draft]: Icons.multiplyCircle,
  }

  return statusIcons[status]
}
