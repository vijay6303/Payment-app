import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { userAtom } from "../store/atoms";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";
import { signin } from "../services/operations/authApi";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showError, setShowError] = useState(false);
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();

  function changeHandler(event) {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signin(formData.email, formData.password);
      console.log("Signin response:", response);
      
      if (response.success && response.data) {
        setUser({
          _id: response.data.user._id,
          firstname: response.data.user.firstname,
          lastname: response.data.user.lastname,
          balance: response.data.balance
        });
        navigate("/dashboard");
      } else {
        setShowError(true);
      }
    } catch (error) {
      setShowError(true);
      console.error("Signin error:", error);
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="bg-white rounded-lg w-[80%] sm:w-[50%] lg:w-[23%] text-center p-3">
        <div className="flex flex-col">
          <Heading label={"Sign In"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            label={"Email"}
            placeholder={"johndoe@example.com"}
            name={"email"}
            value={formData.email}
            onChange={changeHandler}
          />
          <InputBox
            label={"Password"}
            placeholder={"123456"}
            name={"password"}
            value={formData.password}
            onChange={changeHandler}
          />
          <Button label={"Sign in"} onClick={handleSubmit} />
          <BottomWarning
            label={"Don't have an account? "}
            to={"/signup"}
            buttonText={"Sign up"}
          />
          {showError && (
            <div className="font-light text-red-700 text-xs mt-2">
              Invalid credentials!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signin;