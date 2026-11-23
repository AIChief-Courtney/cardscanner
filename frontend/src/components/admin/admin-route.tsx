"use client";

import { useEffect } from "react";

/** Applies document-level admin theme (dark canvas, hide marketing ambient). */
export function AdminRouteEffects() {
  useEffect(() => {
    document.documentElement.classList.add("admin-route");
    document.body.classList.add("admin-route-body");
    return () => {
      document.documentElement.classList.remove("admin-route");
      document.body.classList.remove("admin-route-body");
    };
  }, []);
  return null;
}