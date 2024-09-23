import React from "react"
import { Footer } from "~/features/storefront/components/footer"

import Navbar from "./_components/navbar"

const StorefrontRoutesLayout = async ({
  children,
}: React.PropsWithChildren) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* <div className="border-b py-2 text-center text-xs tracking-wider text-muted-foreground">
        Peace be upon on you السلام عليكم
      </div> */}
      <Navbar />
      {children}
      <Footer className="mt-auto" />
    </div>
  )
}

export default StorefrontRoutesLayout
