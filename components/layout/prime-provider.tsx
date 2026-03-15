"use client";

import { PrimeReactProvider } from "primereact/api";

export function PrimeProvider({ children }: { children: React.ReactNode }) {
  // Configuração opcional do PrimeReact (ex: ripple effects)
  return (
    <PrimeReactProvider value={{ ripple: true }}>
      {children}
    </PrimeReactProvider>
  );
}
