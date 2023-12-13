import apiClient from "@/lib/apiClient";
import { useRouter } from "next/router";
import React, { ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: null | {
    id: number;
    username: string;
    email: string;
  };
  login: (token: string) => void;
  logout: () => void;
};

interface AuthProviderProps {
  children: ReactNode;
};

const AuthContext = React.createContext<AuthContextType>({
  // 初期値
  user: null,
  login: () => { },
  logout: () => { }
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<null | {
    id: number;
    username: string;
    email: string;
  }>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
    }
    apiClient.defaults.headers["Authorization"] = `Bearer ${token}`

    apiClient.get("/users/find").then((res) => {
      setUser(res.data.user);
    })
      .catch((error) => {
        console.log(error);
      });

  }, [])

  const login = async (token: string) => {
    localStorage.setItem("auth_token", token);
    apiClient.defaults.headers["Authorization"] = `Bearer ${token}`

    try {
      await apiClient.get("/users/find").then((res) => {
        setUser(res.data.user);
      });

    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    delete apiClient.defaults.headers["Authorization"];
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};