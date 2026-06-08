import { Link } from "react-router-dom";
import { useLogin } from "@/hooks/InventoryHooks";
import { saveToken } from "@/utils/tokenUtils";
import { useNavigate } from "react-router";
import { LoginForm } from "@/components/auth/LoginForm";

export default function Login() {
  const navigate = useNavigate();

  const { mutate: loginUser, isPending, isError, error } = useLogin();

  const handleLogin = (AuthRequestDTO) => {
    loginUser(AuthRequestDTO, {
      onSuccess: (AuthResponseDTO) => {
        saveToken(AuthResponseDTO.token);
        navigate("/dashboard");
      },
      onError: (error) => {
        console.error(error.response?.data);
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-10 dark:bg-neutral-950">
      <div className="w-full max-w-[420px]">
        <div className="rounded-2xl bg-neutral-0 p-8 shadow-lg dark:border dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-neutral-1000 dark:text-neutral-0">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Sign in to Monisha IMS
            </p>
          </div>

          {isError && (
            <div className="mb-5 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-700 dark:border-primary-900 dark:bg-primary-950 dark:text-primary-300">
              {error.response?.data?.message || "Failed to login. Please try again."}
            </div>
          )}

          <LoginForm handleLogin={handleLogin} isPending={isPending} />

          <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary-500 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
            >
              Create one
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-400 dark:text-neutral-600">
          Monisha IMS — School Uniform Inventory
        </p>
      </div>
    </div>
  );
}
