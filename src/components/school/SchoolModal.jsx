import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { X, Loader2 } from "lucide-react";
import Modal from "@/components/shared/Modal";
import {
  schoolRequestSchema,
  schoolRequestDefaultValues,
} from "@/yupSchema/school/SchoolRequestDTO";

// ─── Shared input styles ─────────────────────────────────────

const inputBase =
  "w-full rounded-input border bg-surface-elevated px-16 py-12 text-body-normal text-text-primary placeholder:text-text-muted outline-none transition-all duration-200";
const inputOk =
  "border-border-default focus:border-border-focus focus-ring";
const inputErr =
  "border-danger-main focus:border-danger-hover focus:ring-2 focus:ring-danger-bg";

/**
 * SchoolModal — used for both Create and Edit.
 *
 * Uses the shared Modal wrapper which handles <dialog> open/close,
 * backdrop, focus trapping, and ESC close natively.
 * No useEffect needed — Modal handles the isOpen → showModal/close sync.
 *
 * Props:
 *   dialogRef  — React ref for imperative .showModal()/.close() control
 *   isOpen     — controls visibility
 *   onClose    — called when dialog closes
 *   onSubmit   — called with { schoolName } when form is valid
 *   isPending  — disables submit button while mutation is running
 *   school     — if provided, pre-fills the form (Edit mode)
 */
export const SchoolModal = ({ dialogRef, isOpen, onClose, onSubmit, isPending, school }) => {

  // ─── Form state ──────────────────────────────────────────────
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schoolRequestSchema),
    defaultValues: school ? { schoolName: school.schoolName } : schoolRequestDefaultValues,
    mode: "onBlur",
  });

  // ─── Render ──────────────────────────────────────────────────
  return (
    <Modal ref={dialogRef} isOpen={isOpen} onClose={onClose}
      className="w-full max-w-md rounded-panel bg-surface-default p-24 md:p-32 shadow-elevation-4">

      {/* ── Header ─── */}
      <div className="mb-20 flex items-center justify-between">
        <h2 className="text-h4 font-semibold text-text-primary">{school ? "Edit School" : "Create School"}</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-input p-8 text-text-muted hover:bg-surface-muted hover:text-text-primary transition-colors press-scale"
          aria-label="Close modal"
        >
          <X className="h-18 w-18" />
        </button>
      </div>

      {/* ── Form ─── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-20">

        {/* ── School Name Field ─── */}
        <div>
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
            School Name
          </label>
          <input
            type="text"
            placeholder="e.g. Zimuto High School"
            aria-invalid={errors.schoolName ? "true" : "false"}
            className={`${inputBase} ${errors.schoolName ? inputErr : inputOk}`}
            {...register("schoolName")}
          />
          {errors.schoolName && (
            <p className="mt-4 text-body-small text-danger-main">{errors.schoolName.message}</p>
          )}
        </div>

        {/* ── Actions ─── */}
        <div className="flex items-center justify-end gap-12 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-input border border-border-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 press-scale"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-8 rounded-input bg-brand-primary px-14 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed disabled:cursor-not-allowed disabled:opacity-60 press-scale transition-all duration-200"
          >
            {isPending ? (<><Loader2 className="h-16 w-16 animate-spin" />{school ? "Saving..." : "Creating..."}</>) : school ? ("Save Changes") : ("Create School")}
          </button>
        </div>
      </form>

    </Modal>
  );
};
