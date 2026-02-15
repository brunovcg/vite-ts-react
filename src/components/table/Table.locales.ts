import { locales } from "@/locales";

export const tableLocale = locales.create({
  enUS: {
    loading: "Loading...",
    loadingTableData: "Loading table data",
    noData: "No data available.",
    noResults: "No results found matching your filters.",
    of: "of",
    previousPage: "Previous page",
    nextPage: "Next page",
    rowsPerPage: "Rows per page:",
    tablePagination: "Table pagination",
    sortBy: "Sort by {{column}}",
  },
  ptBR: {
    loading: "Carregando...",
    loadingTableData: "Carregando dados da tabela",
    noData: "Nenhum dado disponível.",
    noResults: "Nenhum resultado encontrado para os filtros.",
    of: "de",
    previousPage: "Página anterior",
    nextPage: "Próxima página",
    rowsPerPage: "Linhas por página:",
    tablePagination: "Paginação da tabela",
    sortBy: "Ordenar por {{column}}",
  },
});
