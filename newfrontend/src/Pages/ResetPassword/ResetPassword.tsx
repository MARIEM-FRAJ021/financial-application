import React, { useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/useAuth";
import Spinner from "../../Components/Spinners/Spinner";
import { useForm } from "react-hook-form";

type FormData = {
  password: string;
  confirmPassword: string;
};

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const { resetPassword, resetMessage } = useAuth();

  const token = searchParams.get("token")!;
  const email = searchParams.get("email")!;

  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setSubmitting(true);
    try {
      await resetPassword(email, data.password, token);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen">
        <div className="w-full p-6 bg-white rounded-lg shadow sm:max-w-md">
          <h2 className="mb-4 text-2xl font-bold text-center text-gray-900">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-md"
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

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-md"
                {...register("confirmPassword", { required: "Please confirm password" })}
              />
               {errors.confirmPassword ? (
                <p className="text-red-600 italic text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              ) : (
                ""
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              disabled={submitting}
            >
              {submitting ? "Validating..." : "Validate password"}
            </button>
          </form>

          <div className="mt-4 text-center">
            {submitting && !resetMessage && <Spinner />}
          </div>
        </div>
      </div>
    </section>
  );
};
