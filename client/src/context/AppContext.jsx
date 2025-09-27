import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  axios.defaults.withCredentials = true;

  async function getUserData() {
    try {
      const { data } = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/user/data"
      );
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function getAuthState() {
    try {
      const { data } = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/is-auth"
      );
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
