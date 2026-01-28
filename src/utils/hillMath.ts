import type { Funcionalidade, HillPoint } from '../types';

export const CHART_WIDTH = 900;
export const CHART_HEIGHT = 550;
export const BASE_Y = 450;
export const PEAK_Y = 120;
export const MARGIN_X = 30; // Horizontal margin to extend curve closer to edges
export const EFFECTIVE_WIDTH = CHART_WIDTH - (2 * MARGIN_X); // Curve spans this width

// CRIA Methodology Stages
export type CriaStage = 'Clarificar' | 'Refinar' | 'Implementar' | 'Aprimorar';

export function getCriaStage(progress: number): CriaStage {
    if (progress <= 25) return 'Clarificar';
    if (progress <= 50) return 'Refinar';
    if (progress <= 75) return 'Implementar';
    return 'Aprimorar';
}

export function getCriaStageColor(stage: CriaStage): string {
    switch (stage) {
        case 'Clarificar': return '#FCA5A5';
        case 'Refinar': return '#FDE047';
        case 'Implementar': return '#86EFAC';
        case 'Aprimorar': return '#60A5FA';
    }
}

export function getHillCoordinate(progress: number): { x: number; y: number } {
    // Add margin so curve extends closer to canvas edges
    const x = MARGIN_X + (progress / 100) * EFFECTIVE_WIDTH;
    const theta = (progress / 100) * Math.PI;
    const curveHeight = Math.sin(theta);
    const y = BASE_Y - (curveHeight * (BASE_Y - PEAK_Y));
    return { x, y };
}

export function mapSizeToColor(sizeStr?: string): string {
    const size = (sizeStr || '').toUpperCase();
    switch (size) {
        case 'P': return '#34D399';
        case 'M': return '#3B82F6';
        case 'G': return '#8B5CF6';
        case 'GG': return '#F59E0B';
        case 'XGG': return '#EF4444';
        default: return '#9CA3AF';
    }
}

export function mapSizeToRadius(sizeNum?: number): number {
    const size = sizeNum || 1;
    return Math.min(Math.max(size * 1.5, 6), 14);
}

// Comprehensive collision detection
function resolveLabelCollisions(points: HillPoint[]): HillPoint[] {
    const sorted = [...points].sort((a, b) => a.x - b.x);
    const iterations = 12;
    const labelHeight = 28;
    const labelWidth = 90;
    const minDistanceFromAnyCircle = 26;

    for (const point of sorted) {
        const minY = point.y - point.size - minDistanceFromAnyCircle;
        point.labelY = minY;
    }

    for (let iter = 0; iter < iterations; iter++) {
        for (let i = 0; i < sorted.length; i++) {
            const p1 = sorted[i];
            let y1 = p1.labelY ?? (p1.y - 20);

            // Check against ALL circles
            for (let j = 0; j < sorted.length; j++) {
                if (i === j) continue;

                const p2 = sorted[j];
                const distToCircle = Math.sqrt(
                    Math.pow(p1.x - p2.x, 2) +
                    Math.pow(y1 - p2.y, 2)
                );

                if (distToCircle < p2.size + minDistanceFromAnyCircle) {
                    p1.labelY = (p1.labelY ?? y1) - 5;
                    y1 = p1.labelY;
                }
            }

            // Label-to-label collisions
            for (let k = i + 1; k < sorted.length; k++) {
                const p2 = sorted[k];
                const y2 = p2.labelY ?? (p2.y - 20);

                if (Math.abs(p1.x - p2.x) < labelWidth) {
                    if (Math.abs(y1 - y2) < labelHeight) {
                        const overlap = labelHeight - Math.abs(y1 - y2);
                        const move = overlap / 2 + 4;

                        if (y1 < y2) {
                            p1.labelY = (p1.labelY ?? y1) - move;
                            p2.labelY = (p2.labelY ?? y2) + move;
                        } else {
                            p1.labelY = (p1.labelY ?? y1) + move;
                            p2.labelY = (p2.labelY ?? y2) - move;
                        }
                    }
                }
            }
        }
    }

    return sorted;
}

export function prepareDataForChart(features: Funcionalidade[]): HillPoint[] {
    const points = features.map(f => {
        const { x, y } = getHillCoordinate(f.property_progresso || 0);
        return {
            id: f.id,
            label: f.name,
            x,
            y,
            labelY: y - 25,
            size: mapSizeToRadius(f.property_f_tamanho),
            color: mapSizeToColor(f.property_tamanho),
            data: f
        };
    });

    return resolveLabelCollisions(points);
}
