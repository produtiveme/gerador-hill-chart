import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { Sistema } from '../types';
import SystemCard from '../components/SystemCard';
import ChartViewer from './ChartViewer';

export default function Home() {
    const [sistemas, setSistemas] = useState<Sistema[]>([]);
    const [selectedSystem, setSelectedSystem] = useState<Sistema | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const data = await api.fetchSistemas();
                setSistemas(data);
            } catch (err) {
                setError('Falha ao carregar sistemas.');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (selectedSystem) {
        return <ChartViewer system={selectedSystem} onBack={() => setSelectedSystem(null)} />;
    }

    if (loading) return <div className="p-8 text-center animate-pulse">Carregando seus projetos...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <header className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Meus Sistemas</h1>
                        <p className="text-gray-500">Selecione um sistema para visualizar o Hill Chart</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Sair
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sistemas.map(sys => (
                    <SystemCard key={sys.id} system={sys} onClick={setSelectedSystem} />
                ))}
            </div>
        </div>
    );
}
