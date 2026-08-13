"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function ClientOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  return mounted ? children : null;
}