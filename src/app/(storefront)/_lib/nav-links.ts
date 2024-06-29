interface NavLink {
  heading: string
  href: string
  subLinks?: NavLink[]
}

export const navLinks: NavLink[] = [
  {
    heading: "Footwear",
    href: "/shop/footwear",
    subLinks: [
      {
        heading: "Men",
        href: "/shop/footwear/men",
        subLinks: [
          {
            heading: "Sneakers",
            href: "/shop/footwear/men/sneakers",
          },
          {
            heading: "Lifestyle shoes",
            href: "/shop/footwear/men/lifestyle-shoes",
          },
          {
            heading: "Boots",
            href: "/shop/footwear/men/boots",
          },
        ],
      },
      {
        heading: "Women",
        href: "/shop/footwear/women",
        subLinks: [
          {
            heading: "Sneakers",
            href: "/shop/footwear/women/sneakers",
          },
          {
            heading: "Lifestyle shoes",
            href: "/shop/footwear/women/lifestyle-shoes",
          },
          {
            heading: "Boots",
            href: "/shop/footwear/women/boots",
          },
        ],
      },
      {
        heading: "Kids",
        href: "/shop/footwear/kids",
        subLinks: [
          {
            heading: "Preschool Sneakers",
            href: "/shop/footwear/kids/preschool-sneakers",
          },
          {
            heading: "Proschool Sneakers",
            href: "/shop/footwear/kids/proschool-sneakers",
          },
          {
            heading: "Toddler Sneakers",
            href: "/shop/footwear/kids/toddler-sneakers",
          },
        ],
      },
      {
        heading: "Sale",
        href: "/shop/footwear/sale",
        subLinks: [
          {
            heading: "Men",
            href: "/shop/footwear/sale/men",
          },
          {
            heading: "Women",
            href: "/shop/footwear/sale/women",
          },
          {
            heading: "Kids",
            href: "/shop/footwear/sale/kids",
          },
        ],
      },
    ],
  },
  {
    heading: "Clothing",
    href: "/shop/clothing",
    subLinks: [
      {
        heading: "Men",
        href: "/shop/clothing/men",
        subLinks: [
          {
            heading: "Shirts",
            href: "/shop/clothing/men/shirts",
          },
          {
            heading: "Pants",
            href: "/shop/clothing/men/pants",
          },
          {
            heading: "Jackets",
            href: "/shop/clothing/men/jackets",
          },
        ],
      },
      {
        heading: "Women",
        href: "/shop/clothing/women",
        subLinks: [
          {
            heading: "Shirts",
            href: "/shop/clothing/women/shirts",
          },
          {
            heading: "Pants",
            href: "/shop/clothing/women/pants",
          },
          {
            heading: "Jackets",
            href: "/shop/clothing/women/jackets",
          },
        ],
      },
      {
        heading: "Kids",
        href: "/shop/clothing/kids",
        subLinks: [
          {
            heading: "Shirts",
            href: "/shop/clothing/kids/shirts",
          },
          {
            heading: "Pants",
            href: "/shop/clothing/kids/pants",
          },
          {
            heading: "Jackets",
            href: "/shop/clothing/kids/jackets",
          },
        ],
      },
      {
        heading: "Sale",
        href: "/shop/clothing/sale",
        subLinks: [
          {
            heading: "Men",
            href: "/shop/clothing/sale/men",
          },
          {
            heading: "Women",
            href: "/shop/clothing/sale/women",
          },
          {
            heading: "Kids",
            href: "/shop/clothing/sale/kids",
          },
        ],
      },
    ],
  },
]
