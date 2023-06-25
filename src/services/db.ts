import { User } from "@/types/user";
import createRTDB from "./rtdb-crud";

export const userDB = createRTDB<User>('users');