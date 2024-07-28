import React from "react"

import { CartLineItem } from "~/types"
import Footer from "~/components/footer"
import { api } from "~/trpc/server"

import Navbar from "./_components/navbar"

const StorefrontRoutesLayout = async ({
  children,
}: React.PropsWithChildren) => {
  const cartLineItems = await api.carts.getCartItems()
  // const cartLineItems: CartLineItem[] = [];

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* <div className="border-b py-2 text-center text-xs tracking-wider text-muted-foreground">
        Peace be upon on you السلام عليكم
      </div> */}
      <Navbar cartLineItems={cartLineItems} />
      {children}
      <Footer className="mt-auto" />
    </div>
  )
}

export default StorefrontRoutesLayout
