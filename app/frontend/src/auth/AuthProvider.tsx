import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { firebaseAuth, googleProvider, isFirebaseConfigured } from "./firebase";

export interface LabUser {
  uid: string;
  email: string;
  displayName: string;
  provider: "firebase" | "demo";
  role: "admin" | "docente" | "encargado" | "alumno";
}

interface AuthContextValue {
  user: LabUser | null;
  loading: boolean;
  authMode: "firebase" | "demo";
  error?: string;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const demoSessionKey = "robolab-demo-user";

function mapFirebaseUser(user: User): LabUser {
  return {
    uid: user.uid,
    email: user.email ?? "sin-correo@robolab.local",
    displayName: user.displayName ?? user.email?.split("@")[0] ?? "Usuario RoboLab",
    provider: "firebase",
    role: "encargado"
  };
}

function createDemoUser(email: string): LabUser {
  return {
    uid: "demo-user",
    email,
    displayName: email.split("@")[0] || "Encargado RoboLab",
    provider: "demo",
    role: "encargado"
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "No fue posible autenticar el usuario.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LabUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      const storedUser = window.localStorage.getItem(demoSessionKey);

      if (storedUser) {
        setUser(JSON.parse(storedUser) as LabUser);
      }

      setLoading(false);
      return;
    }

    setPersistence(firebaseAuth, browserLocalPersistence).catch(() => undefined);

    return onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      authMode: isFirebaseConfigured ? "firebase" : "demo",
      error,
      async signIn(email, password) {
        setError(undefined);

        if (!isFirebaseConfigured || !firebaseAuth) {
          const demoUser = createDemoUser(email);
          window.localStorage.setItem(demoSessionKey, JSON.stringify(demoUser));
          setUser(demoUser);
          return;
        }

        try {
          await signInWithEmailAndPassword(firebaseAuth, email, password);
        } catch (signInError) {
          setError(getErrorMessage(signInError));
          throw signInError;
        }
      },
      async signInWithGoogle() {
        setError(undefined);

        if (!isFirebaseConfigured || !firebaseAuth || !googleProvider) {
          const demoUser = createDemoUser("encargado@robolab.local");
          window.localStorage.setItem(demoSessionKey, JSON.stringify(demoUser));
          setUser(demoUser);
          return;
        }

        try {
          await signInWithPopup(firebaseAuth, googleProvider);
        } catch (googleError) {
          setError(getErrorMessage(googleError));
          throw googleError;
        }
      },
      async signOutUser() {
        setError(undefined);

        if (!isFirebaseConfigured || !firebaseAuth) {
          window.localStorage.removeItem(demoSessionKey);
          setUser(null);
          return;
        }

        await firebaseSignOut(firebaseAuth);
      }
    }),
    [error, loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
