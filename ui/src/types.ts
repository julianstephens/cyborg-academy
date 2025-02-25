import type { AuthSession } from "cyborg-utils";
import React from "react";

export interface ChildrenProps {
  children: React.ReactNode;
}

export interface AuthProps extends Partial<AuthSession> {
  checkedAuthStatus: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: VoidFunction;
}

export interface AppInfo {
  appName: string;
  appDescription: string;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps {
  data: SelectOption[];
  value: unknown;
  name: string;
  portalRef: React.RefObject<HTMLDivElement>;
  onChange: (event: React.FormEvent<HTMLSelectElement>) => void;
  onInteractionOutside: (event: unknown) => void;
}

export interface FormError {
  [k: string]: {
    _errors: string[];
  };
}
