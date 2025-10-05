import React, { useState } from "react";
import * as Yup from "yup";
import { useAuth } from "../../Context/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";

type Props = {};

type LoginFormsInputs = {
  userNameOrEmail: string;
  password: string;
};

const validation = Yup.object().shape({
  userNameOrEmail: Yup.string().required("Username/Email is required"),
  password: Yup.string().required("Password is required"),
});

export const LoginPage = (props: Props) => {
  const { loginUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormsInputs>({ resolver: yupResolver(validation) });
  const hanadleLogin = (form: LoginFormsInputs) => {
    debugger;
    loginUser(form.userNameOrEmail, form.password);
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={handleSubmit(hanadleLogin)}
          method="POST"
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="username"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Username Or Email{" "}
            </label>
            <div className="mt-2">
              <input
                id="username"
                type="username"
                placeholder="Enter the username"
                autoComplete="username"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lightGreen sm:text-sm/6"
                {...register("userNameOrEmail")}
              />
              {errors.userNameOrEmail ? (
                <p className="text-red-600 italic text-sm mt-1">
                  {errors.userNameOrEmail.message}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-semibold text-lightGreen hover:text-lightGreen focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lightGreen"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                data-tip={errors.userNameOrEmail?.message}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lightGreen sm:text-sm/6"
                {...register("password")}
              />
              {errors.password ? (
                <p className="text-red-600 italic text-sm mt-1">
                  {errors.password.message}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md text-white bg-lightGreen px-3 py-1.5 text-sm/6 font-semibold hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lightGreen"
            >
              Sign in
            </button>
            <p className="mt-10 text-center text-sm/6 text-lightGreen">
              Not a member?{" "}
              <Link
                to="/register"
                className="font-semibold text-lightGreen hover:text-lightGreen"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
