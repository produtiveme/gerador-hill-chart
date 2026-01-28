import type { Sistema, Funcionalidade } from '../types';

const BASE_API_URL = 'https://work.produ-cloud.com/webhook';

let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null) {
    authToken = token;
}

export function setUnauthorizedHandler(handler: () => void) {
    onUnauthorized = handler;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401 || response.status === 403) {
        if (onUnauthorized) {
            onUnauthorized();
        }
        throw new Error('Sessão inválida ou expirada.');
    }

    return response;
}

export const api = {
    async fetchSistemas(): Promise<Sistema[]> {
        const response = await fetchWithAuth(`${BASE_API_URL}/sodapop-carrega-todo-projeto`);
        if (!response.ok) {
            throw new Error('Erro ao buscar sistemas');
        }
        const data = await response.json();
        return data.map((item: any) => ({
            id: item.ID_Notion_Projeto,
            name: item.Nome_Projeto,
            system: item.Sistema_Projeto,
            deadline: item.Prazo_Final_Projeto,
            progress: item.Progresso,
        }));
    },

    async fetchFuncionalidades(): Promise<Funcionalidade[]> {
        const response = await fetchWithAuth(`${BASE_API_URL}/sodapop-carrega-todo-funcionalidade`);
        if (!response.ok) {
            throw new Error('Erro ao buscar funcionalidades');
        }
        const data = await response.json();
        return data.map((item: any) => ({
            id: item.ID_Funcionalidade_Notion,
            name: item.Nome_Funcionalidade,
            property_projeto: item.property_projeto,
            property_progresso: item.property_progresso,
            property_tamanho: item.property_tamanho,
            property_f_tamanho: item.property_f_tamanho,
            url: item.url,
        }));
    },
};
