import { createContext, useContext, useReducer } from "react";
import { property, PropertyValues } from "../../core/types";

const DocumentContext = createContext<{ scheme: Record<string, property>, value: PropertyValues } | null>(null);
const DispatchDocumentContext = createContext<React.Dispatch<{ type: 'SCHEME' | 'VALUES', payload: Record<string, property> | PropertyValues }> | null>(null);

export function DocumentProvider({ children }: { children: React.ReactNode }) {
    const initialState: { scheme: Record<string, property>, value: PropertyValues } = { scheme: {}, value: {} };
    const reducer = (
        prevState: { scheme: Record<string, property>, value: PropertyValues },
        action: { type: 'SCHEME' | 'VALUES', payload: Record<string, property> | PropertyValues }
    ) => {
        switch (action.type) {
            case 'SCHEME':
                return { ...prevState, scheme: action.payload as Record<string, property> };
            case 'VALUES':
                return { ...prevState, value: action.payload as PropertyValues };
            default:
                return prevState;
        }
    };
    const [value, dispatch] = useReducer(reducer, initialState);
    return (
        <DocumentContext.Provider value={value}>
            <DispatchDocumentContext.Provider value={dispatch}>
                {children}
            </DispatchDocumentContext.Provider>
        </DocumentContext.Provider>
    );
}

export function useDispatchDocument() {
    const context = useContext(DispatchDocumentContext);
    if (context === null) {
        throw new Error("useDispatchDocument must be used within a DocumentProvider");
    }
    return context;
}
export function useDocument() {
    const context = useContext(DocumentContext);
    if (context === null) {
        throw new Error("useDocument must be used within a DocumentProvider");
    }
    return context;
}