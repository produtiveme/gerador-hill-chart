import type { Sistema } from '../types';

interface SystemCardProps {
    system: Sistema;
    onClick: (system: Sistema) => void;
}

export default function SystemCard({ system, onClick }: SystemCardProps) {
    const percent = (system.property_conclus_o || 0) * 100;

    return (
        <div
            onClick={() => onClick(system)}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-100 flex flex-col h-full"
        >
            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{system.name}</h3>
                {system.property_descri_o && (
                    <p className="text-sm text-gray-500 line-clamp-2">{system.property_descri_o}</p>
                )}
            </div>

            <div className="mt-auto space-y-3">
                {/* Status Badge */}
                <div className="flex gap-2">
                    {system.property_status && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                            {system.property_status}
                        </span>
                    )}
                    {system.property_arquivar && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-md font-medium">
                            Arquivado
                        </span>
                    )}
                </div>

                {/* Progress Bar */}
                <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progresso</span>
                        <span>{Math.round(percent)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-brand-orange rounded-full h-2 transition-all duration-500"
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
