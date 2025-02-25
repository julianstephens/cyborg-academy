import { getAuthMe } from "@/api-handlers";
import { AuthContext } from "@/hooks";
import { ChildrenProps } from "@/types";
import { User } from "cyborg-utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const AuthProvider = ({ children }: ChildrenProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkedAuthStatus, setCheckedAuthStatus] = useState(false);
  const [user, setUser] = useState<User | undefined>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const goto = useNavigate();

  const login = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/discord`, {
      credentials: "include",
    });
    const loc = res.headers.get("x-location");
    if (loc) window.location.replace(loc);
  };

  const logout = () => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      credentials: "include",
    })
      .then(() => {
        setUser(undefined);
        goto("/");
      })
      .catch((err) => console.error.bind(err));
  };

  const checkAuthStatus = async () => {
    try {
      const data = await getAuthMe();
      if (data && data.data) {
        setUser(data.data.user);
        setIsAdmin(data.data.isAdmin);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        goto("/");
      }
    } catch {
      setIsAuthenticated(false);
      goto("/");
    }
    setCheckedAuthStatus(true);
  };

  useEffect(() => {
    if (!user) {
      checkAuthStatus();
    }
  }, [user, isAuthenticated, checkAuthStatus]);

  return (
    <AuthContext.Provider
      value={{
        checkedAuthStatus,
        isAuthenticated,
        user,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
