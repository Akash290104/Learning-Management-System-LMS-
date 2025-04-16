import { Skeleton } from "@/components/ui/skeleton";
import { initalSignInFormData, initalSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  
  const [signInFormData, setSignInFormData] = useState(initalSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initalSignUpFormData);
  const [auth, setAuth] = useState({ authenticated: false, user: null });
  const [loading, setLoading] = useState(true);

  const handleRegisterUser = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await registerService(signUpFormData);
      console.log(data);

      if (data.success) {
        toast.success(
          "Registration successful! Kindly login with your email and password."
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error in registering user", error);
      toast.error(error?.response?.data?.message);
    }
    finally{
      setLoading(false);
    }
  };

  const handleloginUser = async (event) => {
    event.preventDefault();
    setLoading(true)

    try {
      const data = await loginService(signInFormData);
      console.log("login", data);

      if (data.success) {
        console.log("step 1", data.accessToken);

        sessionStorage.setItem("accessToken", JSON.stringify(data.accessToken));

        console.log("step 2");

        setAuth({
          authenticated: true,
          user: data.user,
        });
      } else {
        toast.error(data.message);
        setAuth({
          authenticated: false,
          user: null,
        });
      }
    } catch (error) {
      console.log("Error logging in the user", error);
      toast.error(error?.response?.data?.message);
    }finally{
      setLoading(false)
    }
  };

  //check-auth user
  const checkAuthUser = async () => {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticated: true,
          user: data.user,
        });
        setLoading(false);
      } else {
        setAuth({
          authenticated: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log("Authentication check error", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message &&
        (error.response.data.message = "No token hence no authroization")
      ) {
        setAuth({
          authenticated: false,
          user: null,
        });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthUser();
  }, []);

  const resetCredentials = () => {
    setAuth({
      authenticated: false,
      user: null,
    });
  };

  console.log("Auth user", auth);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleloginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
