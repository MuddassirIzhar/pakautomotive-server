import { User } from "../../entities/user.entity";
declare const signJWT: (user: User, secretType: string, callback: (error: Error | null | unknown, token: string | null) => void) => void;
export default signJWT;
