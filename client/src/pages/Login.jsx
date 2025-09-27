import React from "react";

import { useContext, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn, getUserData } = useContext(AppContext);

  async function handleSubmit(e) {
    axios.defaults.withCredentials = true;
    try {
      e.preventDefault();

      if (state === "Sign Up") {
        setIsLoading(true);
        const { data } = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/api/auth/register",
          {
            name,
            email,
            password,
          }
        );
        if (data.success) {
          toast.success("Account has been created!");
          setIsLoggedIn(true);
          setIsLoading(false);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
          setIsLoading(false);
        }
      } else {
        setIsLoading(true);
        const { data } = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/api/auth/login",
          {
            email,
            password,
          }
        );
        if (data.success) {
          toast.success("Logged In successfully!");
          setIsLoggedIn(true);
          setIsLoading(false);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
          setIsLoading(false);
        }
      }
    } catch (err) {
      toast.error(err.message);
      setIsLoading(false);
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        onClick={() => navigate("/")}
        alt="app logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Log in"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Log in to your account!"}
        </p>
        <form onSubmit={handleSubmit}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} />
              <input
                className="bg-transparent outline-none"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full Name"
                required
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} />
            <input
              className="bg-transparent outline-none"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} />
            <input
              className="bg-transparent outline-none"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <p
            className="mb-4 text-indigo-500 cursor-pointer"
            onClick={() => navigate("/reset-password")}
          >
            Forgot Password?
          </p>
          <button className="w-full text-white font-medium cursor-pointer py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900">
            {isLoading ? "Wait..." : state}
          </button>
        </form>
        {state === "Sign Up" ? (
          <p
            onClick={() => setState("Login")}
            className="text-gray-400 text-center text-xs mt-4"
          >
            Already have an account?{" "}
            <span className="text-blue-400 cursor-pointer underline">
              Login here
            </span>
          </p>
        ) : (
          <p
            onClick={() => setState("Sign Up")}
            className="text-gray-400 text-center text-xs mt-4"
          >
            Don' t have an account?{" "}
            <span className="text-blue-400 cursor-pointer underline">
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
