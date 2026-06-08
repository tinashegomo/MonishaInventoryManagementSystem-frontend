import { Link } from "react-router-dom";
import { useRegister } from "@/hooks/InventoryHooks";
import { saveToken } from "@/utils/tokenUtils";
import { useNavigate } from "react-router";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function Register() {
  const navigate = useNavigate();

  const { mutate: registerUser, isPending, isError, error } = useRegister();

  const handleRegister = (UserRequestDTO) => {
    registerUser(UserRequestDTO, {
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
              Create Account
            </h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Join Monisha IMS
            </p>
          </div>

          {isError && (
            <div className="mb-5 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-700 dark:border-primary-900 dark:bg-primary-950 dark:text-primary-300">
              {error.response?.data?.message || "Failed to register. Please try again."}
            </div>
          )}

          <RegisterForm handleRegister={handleRegister} isPending={isPending} />

          <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary-500 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
            >
              Sign in
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
