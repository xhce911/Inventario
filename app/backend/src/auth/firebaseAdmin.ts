import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export function getFirebaseAdminAuth() {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;

  if (!projectId) {
    return undefined;
  }

  if (getApps().length === 0) {
    initializeApp({
      credential: applicationDefault(),
      projectId
    });
  }

  return getAuth();
}
