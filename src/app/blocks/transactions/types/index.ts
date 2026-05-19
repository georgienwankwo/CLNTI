export interface Transaction {
  id: string;
  type: string;
  status: 'Successful' | 'Pending' | 'Failed' | 'Active' | 'Cancelled';
  amount: number;
  date: string;
}
