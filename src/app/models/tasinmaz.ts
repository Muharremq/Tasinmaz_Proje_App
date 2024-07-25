export interface Tasinmaz {
  id: number;
  name: string;
  ada: string;
  parsel: string;
  nitelik: string;
  koordinatX: number;
  koordinatY: number;
  adres: string;
  mahalleId: number;
  mahalle?: any;
  selected?: boolean;
  selectedTasinmazId?: number;
  userId: number;
}
