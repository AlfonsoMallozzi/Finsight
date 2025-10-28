import { ColorPalette } from '../types/widgets';

export interface PaletteColors {
  name: string;
  colors: string[];
}

export const colorPalettes: Record<ColorPalette, PaletteColors> = {
  'banorte-red': {
    name: 'Banorte Red',
    colors: [
      '#E30613',  // Banorte primary red
      '#FF6B35',  // Vibrant orange
      '#F59E0B',  // Amber/gold
      '#DC2626',  // Deeper red
      '#FB923C',  // Light orange
      '#FBBF24',  // Yellow
      '#C50510',  // Dark red
      '#EA580C',  // Burnt orange
      '#FDE047',  // Bright yellow
      '#991B1B',  // Very dark red
      '#FDBA74',  // Peach
      '#FEF3C7'   // Light yellow
    ]
  },
  'sunset-orange': {
    name: 'Sunset Orange',
    colors: ['#FF6B35', '#E85A2A', '#D1491F', '#BA3814', '#FF8254', '#FFA173', '#FFC092', '#FFDFB1', '#FF4500', '#FF6347', '#FF7F50', '#FFA07A']
  },
  'royal-purple': {
    name: 'Royal Purple',
    colors: ['#7B2CBF', '#6320A0', '#4B1481', '#330862', '#9747FF', '#B370FF', '#CF99FF', '#EBC2FF', '#5A189A', '#7209B7', '#9D4EDD', '#C77DFF']
  },
  'amber-gold': {
    name: 'Amber Gold',
    colors: ['#F59E0B', '#D97706', '#B45309', '#92400E', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7', '#EA580C', '#FB923C', '#FDBA74', '#FED7AA']
  },
  'rose-pink': {
    name: 'Rose Pink',
    colors: ['#E11D48', '#BE123C', '#9F1239', '#881337', '#F43F5E', '#FB7185', '#FDA4AF', '#FECDD3', '#F43F5E', '#FB7185', '#FBBF24', '#FDE047']
  },
  'slate-gray': {
    name: 'Slate Gray',
    colors: ['#475569', '#334155', '#1E293B', '#0F172A', '#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0', '#374151', '#4B5563', '#6B7280', '#9CA3AF']
  }
};

export function getPaletteColors(palette: ColorPalette = 'banorte-red'): string[] {
  return colorPalettes[palette].colors;
}
