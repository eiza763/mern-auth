import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export function AppContextProvider({ children }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  axios.defaults.withCredentials = true;

  async function getUserData() {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function getAuthState() {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth");
      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    getAuthState();
  }, []);

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
