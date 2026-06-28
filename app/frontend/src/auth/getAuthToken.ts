import { firebaseAuth, isFirebaseConfigured } from "./firebase";

export async function getAuthToken() {
  if (!isFirebaseConfigured || !firebaseAuth?.currentUser) {
    return undefined;
  }

  return firebaseAuth.currentUser.getIdToken();
}
