export type ModalityLabel = '磁共振' | 'CT' | '血管机' | '超声' | '其他';

export const MODALITY_ORDER: ModalityLabel[] = ['CT', '磁共振', '血管机', '超声', '其他'];

export function getModalityLabel(type: string): ModalityLabel {
  if (type.includes('磁共振')) return '磁共振';
  if (type.includes('CT') || type.includes('PET')) return 'CT';
  if (type.includes('血管')) return '血管机';
  if (type.includes('超声')) return '超声';
  return '其他';
}
