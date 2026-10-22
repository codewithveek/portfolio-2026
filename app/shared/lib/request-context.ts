import { createContext } from "react-router";

/** Per-request CSP nonce, set by the Worker entry (PRD §9.9). */
export const cspNonceContext = createContext<string>("");
