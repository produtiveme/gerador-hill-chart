import type { Sistema, Funcionalidade } from '../types';

const BASE_API_URL = 'https://work.produ-cloud.com/webhook';

export const api = {
    // Internal endpoints - NO authentication required
    async fetchSistemas(): Promise<Sistema[]> {
        const response = await fetch(`${BASE_API_URL}/sodapop-carrega-todo-projeto`, {
            headers: { 'Content-Type': 'application/json' },
        });
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
        const response = await fetch(`${BASE_API_URL}/sodapop-carrega-todo-funcionalidade`, {
            headers: { 'Content-Type': 'application/json' },
        });
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
