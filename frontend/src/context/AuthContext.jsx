import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("kcttw_token") || sessionStorage.getItem("kcttw_token");
    const savedUser = localStorage.getItem("kcttw_user") || sessionStorage.getItem("kcttw_user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify with live profile in background
        authApi.getMe()
          .then((res) => {
            if (res.success && res.data?.user) {
              setUser(res.data.user);
              localStorage.setItem("kcttw_user", JSON.stringify(res.data.user));
            }
          })
          .catch(() => {
            // Keep local state on network blip
          });
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, remember = true) => {
    const res = await authApi.login(email, password);
    if (res.success && res.data) {
      const { user: userData, token: jwtToken } = res.data;
      setUser(userData);
      setToken(jwtToken);

      const storage = remember ? localStorage : sessionStorage;
      const altStorage = remember ? sessionStorage : localStorage;
      altStorage.removeItem("kcttw_token");
      altStorage.removeItem("kcttw_user");

      storage.setItem("kcttw_token", jwtToken);
      storage.setItem("kcttw_user", JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.message || "Invalid credentials.");
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.success && res.data) {
      const { user: newUser, token: jwtToken } = res.data;
      setUser(newUser);
      setToken(jwtToken);
      localStorage.setItem("kcttw_token", jwtToken);
      localStorage.setItem("kcttw_user", JSON.stringify(newUser));
      return newUser;
    }
    throw new Error(res.message || "Registration failed.");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("kcttw_token");
    localStorage.removeItem("kcttw_user");
    sessionStorage.removeItem("kcttw_token");
    sessionStorage.removeItem("kcttw_user");
  };

  const updateProfile = async (profileData) => {
    const res = await authApi.updateProfile(profileData);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
      localStorage.setItem("kcttw_user", JSON.stringify(res.data.user));
      return res.data.user;
    }
    throw new Error(res.message || "Failed to update profile.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!user && !!token,
        loading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
