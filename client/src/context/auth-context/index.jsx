import { Skeleton } from "@/components/ui/skeleton";
import { initalSignInFormData, initalSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initalSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initalSignUpFormData);
  const [auth, setAuth] = useState({ authenticated: false, user: null });
  const [loading, setLoading] = useState(true);

  const handleRegisterUser = async (event) => {
    event.preventDefault();

    try {
      const data = await registerService(signUpFormData);
      console.log(data);
    } catch (error) {
      console.log("Error in registering user", error);
    }
  };

  const handleloginUser = async (event) => {
    event.preventDefault();

    try {
      const data = await loginService(signInFormData);
      console.log(data);

      if (data.success) {
        console.log("step 1", data.accessToken);

        sessionStorage.setItem("accessToken", JSON.stringify(data.accessToken));

        console.log("step 2");

        setAuth({
          authenticated: true,
          user: data.user,
        });
      } else {
        setAuth({
          authenticated: false,
          user: null,
        });
      }
    } catch (error) {
      console.log("Error logging in the user", error);
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
