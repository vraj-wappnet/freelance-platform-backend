// src/common/interfaces/user-request.interface.ts
import { Request } from "express";

export interface UserRequest extends Request {
  user: {
    id: string;
    // Add other user properties if needed (e.g., email, role)
  };
}
