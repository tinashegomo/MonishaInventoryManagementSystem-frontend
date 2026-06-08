import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  authRequestSchema,
  authRequestDefaultValues,
} from "@/yupSchema/auth/AuthRequestDTO";

export const LoginForm = ({ handleLogin, isPending }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(authRequestSchema),
    defaultValues: authRequestDefaultValues,
    mode: "onBlur",
  });

  const inputBase =
    "w-full rounded-lg border bg-neutral-0 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors duration-200 dark:bg-neutral-900 dark:text-neutral-0 dark:placeholder-neutral-500";
  const inputOk =
    "border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-neutral-700 dark:focus:border-primary-500 dark:focus:ring-primary-900";
  const inputErr =
    "border-primary-500 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 dark:border-primary-400 dark:focus:border-primary-400 dark:focus:ring-primary-900";

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          Email
        </label>
        <input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={errors.email ? "true" : "false"}
          className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs font-medium text-primary-600 dark:text-primary-400">
            {errors.email.message}
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
            autoComplete="current-password"
            placeholder="Enter password"
            aria-invalid={errors.password ? "true" : "false"}
            className={`${inputBase} pr-10 ${errors.password ? inputErr : inputOk}`}
            {...register("password")}
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
        {errors.password && (
          <p className="mt-1.5 text-xs font-medium text-primary-600 dark:text-primary-400">
            {errors.password.message}
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
            Logging in...
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};
