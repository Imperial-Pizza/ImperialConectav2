export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface Order {
  id: string;
  table: number;
  items: OrderItem[];
  status: 'pendente' | 'em_producao' | 'pronto' | 'entregue';
  createdAt: string;
  totalPrice: number;
}
