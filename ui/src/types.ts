import type { User } from "cyborg-utils";
import React from "react";

export interface ChildrenProps {
  children: React.ReactNode;
}

export interface UserProp {
  user: User;
}

export interface AuthProps extends Partial<UserProp> {
  checkedAuthStatus: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: VoidFunction;
}

export interface AppInfo {
  appName: string;
  appDescription: string;
}
