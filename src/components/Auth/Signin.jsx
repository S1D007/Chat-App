import React, { useEffect, useState } from "react";
import { useStore } from "../../../suppliers/zustand";
import { useRouter } from "next/router";

const Signin = () => {
  const [details, setDetails] = useState({
    username: "",
    password: "",
  });
  const { signin } = useStore();
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full md:w-1/3 bg-white shadow-md rounded p-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">Sign In</h1>
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
            signin(details);
          }}
          className="w-full bg-black text-white font-bold py-2 rounded"
        >
          Submit
        </button>
        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <button onClick={()=>router.push('signup')} className="text-blue-500" type="button">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signin;
