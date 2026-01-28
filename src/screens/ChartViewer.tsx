import { useEffect, useState, useMemo, useRef } from 'react';
import type { Sistema, Funcionalidade } from '../types';
import { api } from '../services/api';
import { prepareDataForChart, getCriaStage } from '../utils/hillMath';
import { HillChart } from '../components/HillChart';
import { toPng } from 'html-to-image';

interface ChartViewerProps {
    system: Sistema;
    onBack: () => void;
}

export default function ChartViewer({ system, onBack }: ChartViewerProps) {
    const [features, setFeatures] = useState<Funcionalidade[]>([]);
    const [loading, setLoading] = useState(true);
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function load() {
            try {
                const allFeatures = await api.fetchFuncionalidades();
                const systemFeatures = allFeatures.filter(f =>
                    f.property_sistema && f.property_sistema.includes(system.id)
                );
                setFeatures(systemFeatures);
            } catch (err) {
                console.error(err);
                alert('Erro ao carregar funcionalidades');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [system.id]);

    const chartPoints = useMemo(() => prepareDataForChart(features), [features]);

    const handleDownload = async () => {
        if (!chartRef.current) return;
        try {
            const dataUrl = await toPng(chartRef.current, { cacheBust: true, backgroundColor: '#ffffff' });
            const link = document.createElement('a');
            link.download = `${system.name.replace(/\s+/g, '-').toLowerCase()}-hill-chart.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Error downloading chart:', err);
            alert('Erro ao gerar imagem PNG.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        title="Voltar"
                    >
                        &larr;
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{system.name}</h1>
                        <p className="text-xs text-gray-500">
                            {features.length} Funcionalidades • {system.property_status || 'Em andamento'}
                        </p>
                    </div>
                </div>
                {/* Actions */}
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M12 9.75v10.5m0 0L7.5 15.75M12 20.25l4.5-4.5M12 3v9" />
                    </svg>
                    Baixar PNG
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-[#FFF9F3] p-4 md:p-8">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-gray-400">Carregando gráfico...</div>
                ) : (
                    <div className="space-y-8">
                        {/* The Graphic */}
                        {/* The Graphic */}
                        <section>
                            <HillChart points={chartPoints} ref={chartRef} />
                        </section>

                        {/* List View of Features */}
                        <section className="max-w-7xl mx-auto w-full">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">Detalhes das Funcionalidades</h3>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                                {features.sort((a, b) => (b.property_progresso || 0) - (a.property_progresso || 0)).map(f => (
                                    <div key={f.id} className="p-4 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50 transition-colors">

                                        {/* CRIA Stage & Size */}
                                        <div className="flex items-center gap-3 min-w-[200px]">
                                            <span
                                                className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-gray-200 text-gray-500 bg-gray-50/50"
                                            >
                                                {getCriaStage(f.property_progresso || 0)}
                                            </span>
                                            <span
                                                className="text-xs font-bold px-2 py-1 rounded text-white shadow-sm"
                                                style={{ backgroundColor: chartPoints.find(p => p.id === f.id)?.color || '#9CA3AF' }}
                                            >
                                                {f.property_tamanho || 'N/A'}
                                            </span>
                                        </div>

                                        {/* Name & Type */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full flex-shrink-0`} style={{ backgroundColor: chartPoints.find(p => p.id === f.id)?.color }}></div>
                                                <p className="font-medium text-gray-900 truncate" title={f.name}>{f.name}</p>
                                            </div>
                                            <p className="text-xs text-gray-500 pl-4">{f.property_tipo || 'Geral'}</p>
                                        </div>

                                        {/* Progress Bar & Percentage */}
                                        <div className="flex items-center gap-3 min-w-[200px]">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${f.property_progresso || 0}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold w-10 text-right text-gray-700">{f.property_progresso}%</span>
                                        </div>

                                        {/* Notion Button */}
                                        <div className="flex-shrink-0">
                                            {f.url ? (
                                                <a
                                                    href={f.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange transition-colors"
                                                >
                                                    Abrir no Notion ↗
                                                </a>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic px-3 py-1.5 opacity-50 cursor-not-allowed">Sem link</span>
                                            )}
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
