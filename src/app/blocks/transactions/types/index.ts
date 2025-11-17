export interface Transaction {
  id: string;
  type: string;
  status: 'Successful' | 'Pending' | 'Failed';
  amount: number;
  date: string;
}
