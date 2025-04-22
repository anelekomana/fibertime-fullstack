"use client";

import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

export default function ReactRouterProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <BrowserRouter>{children}</BrowserRouter>;
}
