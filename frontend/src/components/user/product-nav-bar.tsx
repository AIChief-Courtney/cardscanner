"use client";

import { useState } from "react";
import { PRODUCT_NAV_MENUS, type ProductNavMenu } from "@/lib/nav-menus";
import { ProductNavMega } from "./product-nav-mega";

export function ProductNavBar() {
  const [openMenu, setOpenMenu] = useState<ProductNavMenu | null>(null);

  return (
    <div className="product-nav-bar">
      {PRODUCT_NAV_MENUS.map((item) => (
        <ProductNavMega
          key={item.id}
          menu={item.id}
          label={item.label}
          open={openMenu === item.id}
          onOpenChange={(next) => setOpenMenu(next ? item.id : null)}
        />
      ))}
    </div>
  );
}