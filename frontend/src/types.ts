import type { User } from "cyborg-types";
import React from "react";

export interface ChildrenProps {
  children: React.ReactNode;
}

export interface UserProp {
  user: User;
}
