import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthedRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "invalid token" });
  }
}
// export function authMiddleware(
//   req: AuthedRequest,
//   res: Response,
//   next: NextFunction
// ) {
//   req.userId='e6effc3a-abbc-49bb-88e2-d387b95a4b3d';
//   next();
// }
