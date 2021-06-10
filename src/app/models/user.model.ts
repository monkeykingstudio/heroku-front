export interface User {
  _id?: string;
  pseudo: string;
  email: string;
  password: string;
  token?: string;
  // picture?: string;
  is_verified: boolean;
  role: string;
  coloCount: number;
  newsletter?: boolean;
}
