import React from "react";
import { useAuth } from "../../Context/useAuth";
import { useForm } from "react-hook-form";

type Props = {};

type RegisterInputsForm = {
  userName: string;
  password: string;
  email: string;
};

export const RegisterPage = (props: Props) => {
  const { registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputsForm>();
  const hanadleRegister = (form: RegisterInputsForm) => {
    registerUser(form.userName, form.password, form.email);
  };
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">
          Create an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={handleSubmit(hanadleRegister)}
          method="POST"
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="username"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Username{" "}
            </label>
            <div className="mt-2">
              <input
                required
                id="username"
                type="username"
                placeholder="Enter the username"
                autoComplete="username"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lightGreen sm:text-sm/6"
                {...register("userName", {
                  required: "Username is required",
                })}
              />
              {errors.userName ? (
                <p className="text-red-600 italic text-sm mt-1">
                  {errors.userName.message}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email{" "}
            </label>
            <div className="mt-2">
              <input
                id="email"
                placeholder="Enter the email"
                autoComplete="email"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lightGreen sm:text-sm/6"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                })}
              />
              {errors.email ? (
                <p className="text-red-600 italic text-sm mt-1">
                  {errors.email.message}
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
                <a
                  href="#"
                  className="font-semibold text-lightGreen hover:text-lightGreen focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lightGreen"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                required
                id="password"
                type="password"
                placeholder="Enter your password"
                data-tip={errors.userName?.message}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lightGreen sm:text-sm/6"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 12,
                    message: "Password must be at least 12 characters",
                  },
                  validate: {
                    hasLower: (val) =>
                      /[a-z]/.test(val) ||
                      "Password must contain at least one lowercase letter",
                    hasUpper: (val) =>
                      /[A-Z]/.test(val) ||
                      "Password must contain at least one uppercase letter",
                    hasNumber: (val) =>
                      /\d/.test(val) ||
                      "Password must contain at least one number",
                    hasNonAlphanumeric: (val) =>
                      /[^a-zA-Z0-9]/.test(val) ||
                      "Password must contain at least one non-alphanumeric character",
                  },
                })}
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
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
