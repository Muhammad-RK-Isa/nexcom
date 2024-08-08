import React from "react"

import { ThemeSelect } from "~/components/theme-select"

const SettingsPage = () => {
  return (
    <div>
      <div className="mt-auto flex items-center justify-between p-4 pb-2">
        <React.Suspense>
          <ThemeSelect />
        </React.Suspense>
      </div>
    </div>
  )
}

export default SettingsPage
