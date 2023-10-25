import React, { useEffect, useState } from "react";
import { useStore } from "../../../suppliers/zustand";
import { useRouter } from "next/router";

const Signup = () => {
  const [details, setDetails] = useState({
    username: "",
    password: "",
  });
  const router = useRouter();
  const { signup} = useStore();

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full md:w-1/3 bg-white shadow-md rounded p-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">Sign Up</h1>
        <input
          onChange={(event) => {
            setDetails((prevState) => ({
              ...prevState,
              username: event.target.value,
            }));
          }}
          placeholder="Username"
          className="w-full mb-4 p-3 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(event) => {
            setDetails((prevState) => ({
              ...prevState,
              password: event.target.value,
            }));
          }}
          className="w-full mb-4 p-3 border rounded"
        />
        <button
          onClick={() => {
            signup(details);
          }}
          className="w-full bg-black text-white font-bold py-2 rounded"
        >
          Submit
        </button>
        <p className="text-center mt-4 text-sm">
          Already Have an Account?{" "}
          <button onClick={()=>router.push('signin')} className="text-blue-500" type="button">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
