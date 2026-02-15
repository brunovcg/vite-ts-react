import { useContext } from "react";
import { SectionContext } from "./Session.context";

export function useSession() {
    return useContext(SectionContext)
}
