import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  userRequestSchema,
  userRequestDefaultValues,
} from "@/yupSchema/auth/UserRequestDTO";

export const RegisterForm = ({ handleRegister, isPending }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userRequestSchema),
    defaultValues: userRequestDefaultValues,
    mode: "onBlur",
  });

  const inputBase =
    "w-full rounded-lg border bg-neutral-0 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors duration-200 dark:bg-neutral-900 dark:text-neutral-0 dark:placeholder-neutral-500";
  const inputOk =
    "border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-neutral-700 dark:focus:border-primary-500 dark:focus:ring-primary-900";
  const inputErr =
    "border-primary-500 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 dark:border-primary-400 dark:focus:border-primary-400 dark:focus:ring-primary-900";

  return (
    <form onSubmit={handleSubmit(handleRegister)} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Username
        </label>
        <input
          type="text"
          autoComplete="username"
          placeholder="Enter username"
          aria-invalid={errors.userName ? "true" : "false"}
          className={`${inputBase} ${errors.userName ? inputErr : inputOk}`}
          {...register("userName")}
        />
        {errors.userName && (
          <p className="mt-1.5 text-xs font-medium text-primary-600 dark:text-primary-400">
            {errors.userName.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Email
        </label>
        <input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={errors.userEmail ? "true" : "false"}
          className={`${inputBase} ${errors.userEmail ? inputErr : inputOk}`}
          {...register("userEmail")}
        />
        {errors.userEmail && (
          <p className="mt-1.5 text-xs font-medium text-primary-600 dark:text-primary-400">
            {errors.userEmail.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={errors.userPassword ? "true" : "false"}
            className={`${inputBase} pr-10 ${errors.userPassword ? inputErr : inputOk}`}
            {...register("userPassword")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.userPassword && (
          <p className="mt-1.5 text-xs font-medium text-primary-600 dark:text-primary-400">
            {errors.userPassword.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Phone Number
        </label>
        <input
          type="tel"
          autoComplete="tel"
          placeholder="+263 77 123 4567"
          aria-invalid={errors.userPhoneNumber ? "true" : "false"}
          className={`${inputBase} ${errors.userPhoneNumber ? inputErr : inputOk}`}
          {...register("userPhoneNumber")}
        />
        {errors.userPhoneNumber && (
          <p className="mt-1.5 text-xs font-medium text-primary-600 dark:text-primary-400">
            {errors.userPhoneNumber.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-neutral-0 hover:bg-primary-600 active:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-primary-400 dark:active:bg-primary-300"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};
