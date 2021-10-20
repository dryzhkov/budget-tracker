import { useAuth0, User } from "@auth0/auth0-react";
import React from "react";
import { FullPageSpinner } from "../components/lib";
import { useLocalStorage } from "../utils/useLocalStorage";

interface AuthProviderContext {
  isAuthenticated: boolean;
  user: User | undefined;
  login: () => void;
  logout: () => void;
  token: string | undefined;
}

interface AuthProviderProps {
  children: JSX.Element;
}
const AuthContext = React.createContext<AuthProviderContext | undefined>(
  undefined
);
AuthContext.displayName = "AuthContext";

function AuthProvider(props: AuthProviderProps) {
  const [token, setToken] = useLocalStorage<string>("token");
  const {
    loginWithRedirect,
    logout: authOLogout,
    getAccessTokenSilently,
    isAuthenticated,
    user,
    isLoading,
  } = useAuth0();

  const logout = React.useCallback(() => {
    setToken(undefined);
    authOLogout();
  }, [setToken, authOLogout]);

  const login = React.useCallback(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);

  React.useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated && !token) {
        const accessToken = await getAccessTokenSilently();
        setToken(accessToken);
      }
    };

    void fetchToken();
  }, [getAccessTokenSilently, isAuthenticated, setToken, token]);

  const value = React.useMemo(
    () => ({ user, login, logout, isAuthenticated, token }),
    [login, logout, isAuthenticated, user, token]
  );

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return <AuthContext.Provider value={value} {...props} />;
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

export { AuthProvider, useAuth };
