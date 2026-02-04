import { useContext } from "react";
import { LocaleContext } from "./Locale.context";

export const useLocaleContext = () => useContext(LocaleContext);
