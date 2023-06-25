export interface BaseObject {
  id: string;
  /* timestamp in milliseconds since epoch */
  readonly createdAt?: number | string; // readonly because it should only be set once
  /* timestamp in milliseconds since epoch */
  updatedAt?: number;

}