import { User } from "@/utils/customData";
import React, { ReactNode, createContext, useState } from "react";

type AuthContextData = {
  profile: User | null;
  setProfile: (profile: User | null) => void;
};

export const AuthContext = createContext<AuthContextData>({
  profile: null,
  setProfile: () => {},
});

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ profile: profile, setProfile: setProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
