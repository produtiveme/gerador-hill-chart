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
        // API retorna os dados diretamente do Notion (property_*)
        return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            property_descri_o: item.property_descri_o,
            property_funcionalidade: item.property_funcionalidade,
            property_conclus_o: item.property_conclus_o,
            property_arquivar: item.property_arquivar,
            property_status: item.property_status,
            property_prazo: item.property_prazo,
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
        // API retorna os dados diretamente do Notion (property_*)
        return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            property_descri_o: item.property_descri_o,
            property_sistema: item.property_sistema,
            property_f_tamanho: item.property_f_tamanho,
            property_tamanho: item.property_tamanho,
            property_progresso: item.property_progresso,
            property_tipo: item.property_tipo,
            url: item.url,
        }));
    },
};
