export interface Item {
    id: string;
  name?: string;
  barcode?: string;
  quantity?: number;
  frozenDate?: string; // ISO
  shelfIndex?: number; // 0-based shelf row
  side?: 'left' | 'right';
  notes?: string;
  photoDataUrl?: string;
}

