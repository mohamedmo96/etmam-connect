import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api";

interface AuthUser {
  id: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post("/Auth/login", { email, password });
      const result = response.data;

      if (!result?.succeeded) {
        return { error: result?.message || "Login failed" };
      }

      const authData = result.data;

      const mappedUser: AuthUser = {
        id: authData.userId,
        userId: authData.userId,
        userName: authData.userName ?? "",
        email: authData.email ?? email,
        role: authData.role ?? "",
      };

      localStorage.setItem("token", authData.token);
      localStorage.setItem("user", JSON.stringify(mappedUser));

      setToken(authData.token);
      setUser(mappedUser);

      return { error: null };
    } catch (error: any) {
      return {
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Login failed",
      };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};