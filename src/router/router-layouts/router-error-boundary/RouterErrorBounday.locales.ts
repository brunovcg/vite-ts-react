import { locales } from "@/locales";

export const routerErrorBoundaryLocales = locales.create({
  ptBR: { goHome: "Página inicial", error: "Não pudemos achar a pagina que você procura. Ela pode ter sido movida ou deletada ou você não tem permissão para acessá-la.", goBack: "Voltar" },
  enUS: { goHome: "Home page", error: "We couldn't find the page you're looking for. It might have been moved or deleted or you don't have permission to access it.", goBack: "Go back" },
});
