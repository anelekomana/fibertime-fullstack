"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const ReactRouterProvider = dynamic(() => import("../react-router-provider"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function ClientRouterProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ReactRouterProvider>{children}</ReactRouterProvider>;
}
