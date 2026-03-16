"use client";

import { PrimeReactProvider, addLocale } from "primereact/api";

// Configura o locale pt-BR para componentes como Calendar e DataTable
addLocale('pt-BR', {
    firstDayOfWeek: 0,
    dayNames: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
    dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
    dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
    monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
    today: 'Hoje',
    clear: 'Limpar',
});

export function PrimeProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrimeReactProvider value={{ ripple: true, locale: 'pt-BR' }}>
      {children}
    </PrimeReactProvider>
  );
}

