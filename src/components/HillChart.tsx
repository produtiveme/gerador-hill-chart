import React from 'react';
import type { HillPoint } from '../types';
import { CHART_WIDTH, CHART_HEIGHT, BASE_Y, PEAK_Y, MARGIN_X, EFFECTIVE_WIDTH } from '../utils/hillMath';

interface HillChartProps {
    points: HillPoint[];
}

export const HillChart = React.forwardRef<HTMLDivElement, HillChartProps>(({ points }, ref) => {


    // Calculate path data for the hill
    // We used a parabola logic in utils: y = 1 - x^2 (normalized)
    // Let's replicate the curve in SVG Path to match the points logic exactly.
    // Actually, to make it perfectly smooth, we can generate many points along the curve for the <path> 'd' attribute

    const generatePath = () => {
        let d = `M ${MARGIN_X} ${BASE_Y}`;
        for (let i = 0; i <= 100; i++) {
            const t = i / 100;
            const x = MARGIN_X + t * EFFECTIVE_WIDTH;


            const theta = t * Math.PI;
            const curveHeight = Math.sin(theta);

            const y = BASE_Y - (curveHeight * (BASE_Y - PEAK_Y));
            d += ` L ${x} ${y}`;
        }
        return d;
    }

    const curvePath = generatePath();

    return (
        <div ref={ref} className="w-full overflow-x-auto bg-white p-2 rounded-xl">
            <div className="min-w-[900px] mx-auto relative">
                <svg
                    viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                    className="w-full h-auto drop-shadow-lg bg-white rounded-xl"
                    style={{ maxHeight: '60vh' }}
                >
                    {/* Background Details */}
                    <defs>
                        <linearGradient id="hillGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#f3f4f6" />
                            <stop offset="100%" stopColor="#ffffff" />
                        </linearGradient>
                    </defs>

                    {/* Hill Shape Fill */}
                    <path d={`${curvePath} L ${MARGIN_X + EFFECTIVE_WIDTH} ${BASE_Y} L ${MARGIN_X} ${BASE_Y} Z`} fill="url(#hillGradient)" opacity="0.5" />

                    {/* Hill Curve Line */}
                    <path d={curvePath} fill="none" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />

                    {/* Middle Line (Original - kept for reference if needed, but replaced by CRIA dividers) */}
                    {/* <line x1={midX} y1={PEAK_Y} x2={midX} y2={BASE_Y} stroke="#E5E7EB" strokeWidth="2" strokeDasharray="5,5" /> */}

                    {/* CRIA Dividers */}
                    {/* 25% Line */}
                    <line x1={CHART_WIDTH * 0.25} y1={PEAK_Y - 20} x2={CHART_WIDTH * 0.25} y2={BASE_Y} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4,4" />
                    {/* 50% Line */}
                    <line x1={CHART_WIDTH * 0.50} y1={PEAK_Y - 40} x2={CHART_WIDTH * 0.50} y2={BASE_Y} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4,4" />
                    {/* 75% Line */}
                    <line x1={CHART_WIDTH * 0.75} y1={PEAK_Y - 20} x2={CHART_WIDTH * 0.75} y2={BASE_Y} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4,4" />

                    {/* CRIA Labels */}
                    <text x={CHART_WIDTH * 0.125} y={PEAK_Y - 30} textAnchor="middle" className="text-xs font-bold fill-gray-400 font-display">CLARIFICAR</text>
                    <text x={CHART_WIDTH * 0.375} y={PEAK_Y - 50} textAnchor="middle" className="text-xs font-bold fill-gray-400 font-display">REFINAR</text>
                    <text x={CHART_WIDTH * 0.625} y={PEAK_Y - 50} textAnchor="middle" className="text-xs font-bold fill-gray-400 font-display">IMPLEMENTAR</text>
                    <text x={CHART_WIDTH * 0.875} y={PEAK_Y - 30} textAnchor="middle" className="text-xs font-bold fill-gray-400 font-display">APRIMORAR</text>

                    {/* Original Bottom Labels (removed/replaced as requested) */}
                    {/* <text x={50} y={BASE_Y + 30} className="text-sm font-bold fill-gray-400 font-display">DESENVOLVENDO A SOLUÇÃO</text>
                    <text x={CHART_WIDTH - 50} y={BASE_Y + 30} textAnchor="end" className="text-sm font-bold fill-gray-400 font-display">APLICANDO A SOLUÇÃO</text> */}

                    {/* Points */}
                    {points.map((p) => (
                        <g key={p.id} className="group cursor-pointer">
                            <title>{p.label} - {p.data.property_progresso}%</title>

                            {/* Connecting Line if label is moved significantly */}
                            {(p.labelY !== undefined && Math.abs(p.labelY - (p.y - 15)) > 5) && (
                                <line
                                    x1={p.x} y1={p.y - p.size - 2}
                                    x2={p.x} y2={p.labelY + 5}
                                    stroke={p.color}
                                    strokeWidth="1"
                                    opacity="0.5"
                                />
                            )}

                            {/* The Dot */}
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r={p.size}
                                fill={p.color}
                                stroke="white"
                                strokeWidth="2"
                                className="transition-all duration-300 hover:r-10 drop-shadow-md"
                            />

                            {/* Label with Background for Maximum Legibility */}
                            <g>
                                {/* White background box */}
                                <rect
                                    x={p.x - 40}
                                    y={(p.labelY ?? (p.y - 15)) - 11}
                                    width="80"
                                    height="16"
                                    fill="white"
                                    fillOpacity="0.95"
                                    rx="4"
                                    stroke="#D1D5DB"
                                    strokeWidth="0.5"
                                />
                                {/* Text */}
                                <text
                                    x={p.x}
                                    y={p.labelY ?? (p.y - 15)}
                                    textAnchor="middle"
                                    className="text-[10px] font-bold fill-gray-800 group-hover:fill-gray-900 transition-colors"
                                    dominantBaseline="middle"
                                >
                                    {p.label}
                                </text>
                            </g>
                        </g>
                    ))}
                </svg>

                {/* Legend */}
                <div className="absolute top-4 right-4 bg-white/90 p-3 rounded-lg text-xs space-y-1.5 backdrop-blur-sm border border-gray-100 shadow-sm font-medium">
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#34D399]"></div> P</div>
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></div> M</div>
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></div> G</div>
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div> GG</div>
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div> XGG</div>
                </div>
            </div>
        </div>

    );
});
HillChart.displayName = 'HillChart';
