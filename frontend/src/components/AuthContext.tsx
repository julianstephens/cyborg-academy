import { AuthProps, ChildrenProps } from "@/types";
import Cookies from "js-cookie";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router";

const AuthContext = createContext({} as AuthProps);

export const AuthProvider = ({ children }: ChildrenProps) => {
  const goto = useNavigate();

  const login = async () => {
    window.location.replace("/api/auth/discord");
  };

  const logout = () => {
    fetch("/api/auth/logout")
      .then(() => {
        goto("/");
      })
      .catch((err) => console.error.bind(err));
  };

  const isLoggedIn = () => {
    const sessionID = Cookies.get("connect.sid");
    return !!sessionID;
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
