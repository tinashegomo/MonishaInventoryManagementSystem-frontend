import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { warehouseBatchRequestSchema, warehouseBatchRequestDefaultValues } from "@/yupSchema/warehouse/request/WarehouseBatchRequestDTO";

// Shared Tailwind tokens for form inputs
const inputBase =
  "w-full rounded-input border bg-surface-default px-16 py-12 text-body-normal text-text-primary placeholder-text-muted outline-none transition-colors duration-200";
const inputOk =
  "border-border-default focus:border-border-focus focus:ring-2 focus:ring-brand-subtle";
const inputErr =
  "border-danger-main focus:border-danger-hover focus:ring-2 focus:ring-danger-bg";

/**
 * WarehouseForm — create form for new warehouse batches.
 *
 * Uses suggestion dropdowns (onMouseDown + preventDefault) for type/variant/color.
 * Sizes managed in plain React state — not part of RHF.
 * RHF handles main fields; sizes passed separately to onSubmit.
 */
export const WarehouseForm = ({ onSubmit, isPending, batches, submitLabel = "Create Batch" }) => {

  // Controls whether each suggestion dropdown is visible
  const [showTypes, setShowTypes] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [showColors, setShowColors] = useState(false);

  // Deduplicate existing values from the database to use as suggestions
  const types    = [...new Set(batches.map((batch) => batch.type))];
  const variants = [...new Set(batches.map((batch) => batch.variant))];
  const colors   = [...new Set(batches.map((batch) => batch.color))];

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(warehouseBatchRequestSchema),
    defaultValues: warehouseBatchRequestDefaultValues,
    mode: "onBlur",
  });

  // Sizes managed in plain state — dynamic rows, sent separately to backend
  const [sizes, setSizes] = useState([]);

  // Size row helpers
  const addRow = () => {
    setSizes([...sizes, { size: "", quantity: "" }]);
  };

  const removeRow = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  // [field] is bracket notation — field is a variable holding "size" or "quantity"
  const updateRow = (index, field, value) => {
    const updated = [...sizes];
    updated[index] = { ...updated[index], [field]: value };
    setSizes(updated);
  };

  return (
    // RHF validates main fields; sizes passed separately to parent onSubmit
    <form onSubmit={handleSubmit((data) => onSubmit(data, sizes))} className="space-y-20">

      {/* ─── Batch Name + Price ─── */}
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        <div>
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Batch Name</label>
          <input
            type="text"
            placeholder="e.g. Summer Batch 2026"
            aria-invalid={errors.batchName ? "true" : "false"}
            className={`${inputBase} ${errors.batchName ? inputErr : inputOk}`}
            {...register("batchName")}
          />
          {errors.batchName && (<p className="mt-4 text-body-small text-danger-main">{errors.batchName.message}</p>)}
        </div>

        <div>
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Price Per Unit</label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 1500"
            aria-invalid={errors.batchPrice ? "true" : "false"}
            className={`${inputBase} ${errors.batchPrice ? inputErr : inputOk}`}
            {...register("batchPrice")}
          />
          {errors.batchPrice && (<p className="mt-4 text-body-small text-danger-main">{errors.batchPrice.message}</p>)}
        </div>
      </div>

      {/* ─── Type → Variant → Color suggestion dropdowns ─── */}
      <div className="grid grid-cols-1 gap-16 md:grid-cols-3">

        {/*
          TYPE FIELD WITH SUGGESTION DROPDOWN

          The wrapper div handles blur for the entire group (input + dropdown).
          onBlur fires when focus leaves the wrapper div entirely.

          e.currentTarget = the wrapper div itself
          e.relatedTarget = the element that is about to receive focus next

          If the user clicks a suggestion:
            → e.relatedTarget is the suggestion div (still inside the wrapper)
            → e.currentTarget.contains(e.relatedTarget) = true
            → we do NOT close the dropdown so onClick on the suggestion can fire

          If the user clicks somewhere outside:
            → e.relatedTarget is something outside the wrapper
            → e.currentTarget.contains(e.relatedTarget) = false
            → we close the dropdown

          This is cleaner than onMouseDown + setTimeout because we use
          plain onClick on suggestions instead of fighting blur timing
        */}
        <div
          className="relative"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setShowTypes(false);
            }
          }}
        >
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Type</label>
          <input
            type="text"
            placeholder="e.g. Shirt"
            aria-invalid={errors.type ? "true" : "false"}
            className={`${inputBase} ${errors.type ? inputErr : inputOk}`}
            onFocus={() => setShowTypes(true)}
            {...register("type")}
          />
          {showTypes && types.length > 0 && (
            <div className="absolute z-10 mt-2 w-full rounded-input border border-border-default bg-white shadow-lg">
              {types.map((type) => (
                <div
                  key={type}
                  onMouseDown={(e) => { e.preventDefault(); setValue("type", type); setShowTypes(false); }}
                  className="cursor-pointer px-16 py-10 hover:bg-surface-muted"
                >
                  {type}
                </div>
              ))}
            </div>
          )}
          {errors.type && (<p className="mt-4 text-body-small text-danger-main">{errors.type.message}</p>)}
        </div>

        {/* VARIANT FIELD — same pattern as type */}
        <div
          className="relative"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setShowVariants(false);
            }
          }}
        >
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Variant</label>
          <input
            type="text"
            placeholder="e.g. Short Sleeve"
            aria-invalid={errors.variant ? "true" : "false"}
            className={`${inputBase} ${errors.variant ? inputErr : inputOk}`}
            onFocus={() => setShowVariants(true)}
            {...register("variant")}
          />
          {showVariants && variants.length > 0 && (
            <div className="absolute z-10 mt-2 w-full rounded-input border border-border-default bg-white shadow-lg">
              {variants.map((variant) => (
                <div
                  key={variant}
                  onMouseDown={(e) => { e.preventDefault(); setValue("variant", variant); setShowVariants(false); }}
                  className="cursor-pointer px-16 py-10 hover:bg-surface-muted"
                >
                  {variant}
                </div>
              ))}
            </div>
          )}
          {errors.variant && (<p className="mt-4 text-body-small text-danger-main">{errors.variant.message}</p>)}
        </div>

        {/* COLOR FIELD — same pattern as type */}
        <div
          className="relative"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setShowColors(false);
            }
          }}
        >
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Color</label>
          <input
            type="text"
            placeholder="e.g. White"
            aria-invalid={errors.color ? "true" : "false"}
            className={`${inputBase} ${errors.color ? inputErr : inputOk}`}
            onFocus={() => setShowColors(true)}
            {...register("color")}
          />
          {showColors && colors.length > 0 && (
            <div className="absolute z-10 mt-2 w-full rounded-input border border-border-default bg-white shadow-lg">
              {colors.map((color) => (
                <div
                  key={color}
                  onMouseDown={(e) => { e.preventDefault(); setValue("color", color); setShowColors(false); }}
                  className="cursor-pointer px-16 py-10 hover:bg-surface-muted"
                >
                  {color}
                </div>
              ))}
            </div>
          )}
          {errors.color && (<p className="mt-4 text-body-small text-danger-main">{errors.color.message}</p>)}
        </div>

      </div>

        {/* ─── Description (optional) ─── */}
        <div>
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Description (optional)</label>
          <textarea
          rows={3}
          placeholder="Any additional notes..."
          aria-invalid={errors.description ? "true" : "false"}
          className={`${inputBase} resize-none ${errors.description ? inputErr : inputOk}`}
          {...register("description")}
        />
        {errors.description && (<p className="mt-4 text-body-small text-danger-main">{errors.description.message}</p>)}
      </div>

      {/* ─── Sizes & Quantities ─── */}
      <div>
        <div className="mb-12 flex items-center justify-between">
          <label className="text-ui-label font-semibold text-text-secondary">Sizes &amp; Quantities</label>
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-8 rounded-input border border-border-default px-16 py-8 text-body-small font-medium text-brand-primary hover:bg-brand-tint transition-colors duration-200"
          >
            <Plus className="h-14 w-14" />
            Add Size
          </button>
        </div>

        {/* Show a message when no sizes have been added yet */}
        {sizes.length === 0 && (
          <p className="text-body-small text-text-muted">
            No sizes added yet. Click Add Size to begin.
          </p>
        )}

        <div className="space-y-12">
          {sizes.map((row, index) => (
            <div key={index} className="flex items-start gap-12 rounded-card bg-surface-muted p-16">

              <div className="flex-1">
                <label className="mb-4 block text-body-small font-medium text-text-muted">Size</label>
                {/* value drives the input from state, onChange updates state */}
                <input
                  type="text"
                  placeholder="e.g. 32, XL, 10"
                  value={row.size}
                  onChange={(e) => updateRow(index, "size", e.target.value)}
                  className={`${inputBase} ${inputOk}`}
                />
              </div>

              <div className="flex-1">
                <label className="mb-4 block text-body-small font-medium text-text-muted">Quantity</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={row.quantity}
                  onChange={(e) => updateRow(index, "quantity", e.target.value)}
                  className={`${inputBase} ${inputOk}`}
                />
              </div>

              {/* Every row can be deleted since we start with an empty array */}
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="mt-24 rounded-input p-8 text-danger-main hover:bg-danger-bg hover:text-danger-hover transition-colors duration-200"
              >
                <Trash2 className="h-16 w-16" />
              </button>

            </div>
          ))}
        </div>
      </div>

      {/* ─── Submit ─── */}
      <div className="flex items-center gap-12 pt-8">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-8 rounded-input bg-brand-primary px-24 py-12 text-body-normal font-semibold text-neutral-0 hover:bg-brand-hover active:bg-brand-pressed disabled:cursor-not-allowed disabled:opacity-60 transition-colors duration-200"
        >
          {isPending ? (<><Loader2 className="h-16 w-16 animate-spin" />Creating...</>) : (submitLabel)}
        </button>
      </div>

    </form>
  );
};