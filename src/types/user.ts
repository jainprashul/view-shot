import { BaseObject } from "./BaseObject";

export interface User extends BaseObject {
  name : string;
  username : string | null;
  status?: 'online' | 'offline' | 'busy';
  avatar?: string | null;
  lastSeen? : number;
  phone?: string | null;
  email?: string | null;
  lastSignIn?: number | string;
  verified?: boolean;
}
