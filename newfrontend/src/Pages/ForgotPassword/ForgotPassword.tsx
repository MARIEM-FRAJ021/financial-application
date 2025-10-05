import React, { useState } from "react";
import { useAuth } from "../../Context/useAuth";
import Spinner from "../../Components/Spinners/Spinner";

type Props = {};

export const ForgotPassword = (props: Props) => {
  const [email, setEmail] = useState("");
  const { forgotPassword, forgotMessage } = useAuth();
  const [submitting, setSubmitting] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await forgotPassword(email);
    setSubmitting(false);
  };
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 text-sm font-medium">Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md mb-4"
          placeholder="Enter your email"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Send Reset Link{" "}
        </button>
      </form>
      <div className="mt-4 text-center">
        {" "}
        {submitting && forgotMessage===null && <Spinner />}
      </div>
    </div>
  );
};
