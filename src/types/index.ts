// Interface do Sistema (Project)
export interface Sistema {
    id: string;
    name: string;
    property_descri_o?: string;
    property_funcionalidade?: string[]; // IDs das funcionalidades
    property_conclus_o?: number; // 0.0 - 1.0
    property_arquivar?: boolean;
    property_status?: string;
    property_prazo?: {
        start: string;
        end: string | null;
    } | null;
}

// Interface da Funcionalidade (Feature)
export interface Funcionalidade {
    id: string;
    name: string;
    property_descri_o?: string;
    property_sistema?: string[]; // IDs dos sistemas
    property_f_tamanho?: number; // Peso numérico
    property_tamanho?: string; // Label: P, M, G, GG, XGG
    property_progresso?: number; // 0 - 100
    property_tipo?: string;
    url?: string;
}

// Representação visual de um ponto no gráfico
export interface HillPoint {
    id: string;
    label: string;
    x: number;
    y: number;
    labelY?: number; // Optional adjusted label Y position
    size: number;
    color: string;
    data: Funcionalidade;
}
