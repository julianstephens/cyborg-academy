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
  const goto = useNavigate();

  const login = async () => {
    const res = await fetch("/api/auth/discord");
    const loc = res.headers.get("x-location");
    if (loc) window.location.replace(loc);
  };

  const logout = () => {
    fetch("api/auth/logout")
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
        setUser(data.data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
    setCheckedAuthStatus(true);
  };

  useEffect(() => {
    checkAuthStatus();
  }, [user, isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        checkedAuthStatus,
        isAuthenticated,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
