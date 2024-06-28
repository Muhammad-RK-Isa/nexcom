import React from "react"

import Footer from "~/components/footer"

const StorefrontRoutesLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="border-b py-2 text-center text-xs tracking-wider text-muted-foreground">
        Peace be upon on you السلام عليكم
      </div>
      {children}
      <Footer className="sticky bottom-0 mt-auto" />
    </div>
  )
}

export default StorefrontRoutesLayout
