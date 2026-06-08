import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  warehouseBatchRequestSchema,
  warehouseBatchRequestDefaultValues,
} from "@/yupSchema/warehouse/request/WarehouseBatchRequestDTO";
import { useMemo } from "react";

const inputBase =
  "w-full rounded-input border bg-surface-default px-16 py-12 text-body-normal text-text-primary placeholder-text-muted outline-none transition-colors duration-200";
const inputOk =
  "border-border-default focus:border-border-focus focus:ring-2 focus:ring-brand-subtle";
const inputErr =
  "border-danger-main focus:border-danger-hover focus:ring-2 focus:ring-danger-bg";

function ComboInput({ label, name, register, errors, options, placeholder }) {
  const listId = `${name}-list`;
  return (
    <div>
      <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        list={listId}
        aria-invalid={errors[name] ? "true" : "false"}
        className={`${inputBase} ${errors[name] ? inputErr : inputOk}`}
        {...register(name)}
      />
      <datalist id={listId}>
        {options.map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
      {errors[name] && (
        <p className="mt-4 text-body-small text-danger-main">
          {errors[name].message}
        </p>
      )}
    </div>
  );
}

export const WarehouseForm = ({ onSubmit, isPending, existingBatches = [], submitLabel = "Create Batch" }) => {
  const typeOptions = useMemo(
    () => [...new Set(existingBatches.map((b) => b.type).filter(Boolean))],
    [existingBatches]
  );
  const variantOptions = useMemo(
    () => [...new Set(existingBatches.map((b) => b.variant).filter(Boolean))],
    [existingBatches]
  );
  const colorOptions = useMemo(
    () => [...new Set(existingBatches.map((b) => b.color).filter(Boolean))],
    [existingBatches]
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(warehouseBatchRequestSchema),
    defaultValues: warehouseBatchRequestDefaultValues,
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "batchSizes",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-20">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        <div>
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
            Batch Name
          </label>
          <input
            type="text"
            placeholder="e.g. Summer Batch 2026"
            aria-invalid={errors.batchName ? "true" : "false"}
            className={`${inputBase} ${errors.batchName ? inputErr : inputOk}`}
            {...register("batchName")}
          />
          {errors.batchName && (
            <p className="mt-4 text-body-small text-danger-main">
              {errors.batchName.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
            Price Per Unit
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 1500"
            aria-invalid={errors.batchPrice ? "true" : "false"}
            className={`${inputBase} ${errors.batchPrice ? inputErr : inputOk}`}
            {...register("batchPrice")}
          />
          {errors.batchPrice && (
            <p className="mt-4 text-body-small text-danger-main">
              {errors.batchPrice.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
        <ComboInput
          label="Type"
          name="type"
          register={register}
          errors={errors}
          options={typeOptions}
          placeholder="e.g. Shirt"
        />

        <ComboInput
          label="Variant"
          name="variant"
          register={register}
          errors={errors}
          options={variantOptions}
          placeholder="e.g. Short Sleeve"
        />

        <ComboInput
          label="Color"
          name="color"
          register={register}
          errors={errors}
          options={colorOptions}
          placeholder="e.g. White"
        />
      </div>

      <div>
        <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
          Description <span className="text-text-muted">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Any additional notes..."
          aria-invalid={errors.description ? "true" : "false"}
          className={`${inputBase} resize-none ${errors.description ? inputErr : inputOk}`}
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-4 text-body-small text-danger-main">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <div className="mb-12 flex items-center justify-between">
          <label className="text-ui-label font-semibold text-text-secondary">
            Sizes &amp; Quantities
          </label>
          <button
            type="button"
            onClick={() => append({ size: "", quantity: "" })}
            className="flex items-center gap-8 rounded-input border border-border-default px-16 py-8 text-body-small font-medium text-brand-primary hover:bg-brand-tint transition-colors duration-200"
          >
            <Plus className="h-14 w-14" />
            Add Size
          </button>
        </div>

        {errors.batchSizes && !Array.isArray(errors.batchSizes) && (
          <p className="mb-12 text-body-small text-danger-main">
            {errors.batchSizes.message}
          </p>
        )}

        <div className="space-y-12">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-start gap-12 rounded-card bg-surface-muted p-16"
            >
              <div className="flex-1">
                <label className="mb-4 block text-body-small font-medium text-text-muted">
                  Size
                </label>
                <input
                  type="text"
                  placeholder="e.g. 32, XL, 10"
                  aria-invalid={errors.batchSizes?.[index]?.size ? "true" : "false"}
                  className={`${inputBase} ${errors.batchSizes?.[index]?.size ? inputErr : inputOk}`}
                  {...register(`batchSizes.${index}.size`)}
                />
                {errors.batchSizes?.[index]?.size && (
                  <p className="mt-4 text-body-small text-danger-main">
                    {errors.batchSizes[index].size.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label className="mb-4 block text-body-small font-medium text-text-muted">
                  Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  aria-invalid={errors.batchSizes?.[index]?.quantity ? "true" : "false"}
                  className={`${inputBase} ${errors.batchSizes?.[index]?.quantity ? inputErr : inputOk}`}
                  {...register(`batchSizes.${index}.quantity`)}
                />
                {errors.batchSizes?.[index]?.quantity && (
                  <p className="mt-4 text-body-small text-danger-main">
                    {errors.batchSizes[index].quantity.message}
                  </p>
                )}
              </div>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-24 rounded-input p-8 text-danger-main hover:bg-danger-bg hover:text-danger-hover transition-colors duration-200"
                  aria-label="Remove size"
                >
                  <Trash2 className="h-16 w-16" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-12 pt-8">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-8 rounded-input bg-brand-primary px-24 py-12 text-body-normal font-semibold text-neutral-0 hover:bg-brand-hover active:bg-brand-pressed disabled:cursor-not-allowed disabled:opacity-60 transition-colors duration-200"
        >
          {isPending ? (
            <>
              <Loader2 className="h-16 w-16 animate-spin" />
              Creating...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
};
