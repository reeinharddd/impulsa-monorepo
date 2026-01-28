import { UserType } from './enums';

export interface User {
  id: string;
  name: string;
  email?: string;
  type: UserType;
}
