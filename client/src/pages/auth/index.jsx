import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context/index";
import { GraduationCap } from "lucide-react";
import React, { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  const [activeTab, setActiveTab] = useState("signin");

  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleloginUser,
  } = useContext(AuthContext);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const checkIfSignInFormValid = () => {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.userPassword !== ""
    );
  };

  const checkIfSignUpFormValid = () => {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.userPassword !== ""
    );
  };

  console.log(signInFormData);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <div
          onClick={handleNavigate}
          className="flex items-center justify-center"
        >
          <GraduationCap className="h-8 w-8 mr-4" />
          <span className="font-extrabold text-xl">LMS Learn</span>
        </div>
      </header>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={handleTabChange}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent
            value="signin"
            className=" transition-all duration-2000 ease-in-out"
          >
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Sign in to your account</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signInFormControls}
                  buttonText={"Sign In"}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!checkIfSignInFormValid()}
                  handleSubmit={handleloginUser}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent
            value="signup"
            className="transition-all duration-2000 ease-in-out"
          >
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Create your account</CardTitle>
                <CardDescription>
                  Enter your email and password to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signUpFormControls}
                  buttonText={"Sign Up"}
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!checkIfSignUpFormValid()}
                  handleSubmit={handleRegisterUser}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
