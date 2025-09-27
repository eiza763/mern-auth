import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const NavBar = () => {
  const navigate = useNavigate();
  const { userData, setIsLoggedIn, backendUrl, setUserData } =
    useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  async function sendVerificationOtp() {
    try {
      setIsLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );
      if (data.success) {
        setIsLoading(false);
        navigate("/verify-email");
        toast.success(data.message);
      } else {
        setIsLoading(false);
        toast.error(data.message);
      }
    } catch (err) {
      setIsLoading(false);
      toast.error(err.message);
    }
  }

  async function Logout() {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(false);
        navigate("/");
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="flex w-full justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="logo" className="w-28 sm:w-32" />
      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10 cursor-pointer">
            <ul className="list-none m-0 p-2 w-30 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  {isLoading ? "Wait..." : "Verify Email"}
                </li>
              )}
              <li
                onClick={Logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                Log out
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer transition-all"
        >
          Login <img src={assets.arrow_icon} alt="arrow-icon" />
        </button>
      )}
    </div>
  );
};

export default NavBar;
