import type { NextFunction, Request, Response } from "express";
import { getFirebaseAdminAuth } from "./firebaseAdmin.js";

export async function requireFirebaseUser(request: Request, response: Response, next: NextFunction) {
  const adminAuth = getFirebaseAdminAuth();

  if (!adminAuth) {
    response.status(503).json({ error: "Firebase Admin no esta configurado en el backend." });
    return;
  }

  const authorization = request.header("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : undefined;

  if (!token) {
    response.status(401).json({ error: "Falta Authorization Bearer token." });
    return;
  }

  try {
    response.locals.firebaseUser = await adminAuth.verifyIdToken(token);
    next();
  } catch {
    response.status(401).json({ error: "Token de Firebase invalido." });
  }
}
