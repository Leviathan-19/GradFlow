import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const roleGuard = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.rol;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied for this role",
      });
    }
    next();
  };
};
