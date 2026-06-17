import { useState, useMemo } from "react";
import { UserPlus, Check } from "lucide-react";

const inputBase =
  "w-full rounded-input border bg-surface-default px-16 py-12 text-body-normal text-text-primary placeholder-text-muted outline-none transition-colors duration-200";
const inputOk =
  "border-border-default focus:border-border-focus focus:ring-2 focus:ring-brand-subtle";
const inputErr =
  "border-danger-main focus:border-danger-hover focus:ring-2 focus:ring-danger-bg";

/**
 * CustomerInput — typeahead with inline new-customer expansion.
 *
 * Shows a dropdown of existing customers as the user types.
 * If no match found, expands inline fields (phone, address) for creating
 * a new customer when the order is saved.
 *
 * customerMode: true = existing customer, false = new customer, null = nothing selected yet
 */
export default function CustomerInput({register,setValue,errors,customers = [],customerMode,setCustomerMode,selectedCustomer,setSelectedCustomer}) {

  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter customers by name (case-insensitive contains)
  const matchingCustomers = useMemo(() => {
    if (!searchText.trim()) return [];

    const query = searchText.toLowerCase();
    return customers.filter((customer) =>customer.customerName.toLowerCase().includes(query));
  }, [customers, searchText]);

  // Select an existing customer from dropdown
  const handleSelect = (customer) => {
    setSelectedCustomer(customer);
    setCustomerMode(true);
    setValue("customerName", customer.customerName);
    setValue("customerId", customer.customerId);
    setValue("phoneNumber", "");
    setSearchText("");
    setShowDropdown(false);
  };

  // Switch to new customer mode (no match found)
  const handleCreateNew = () => {
    setCustomerMode(false);
    setValue("customerId", "");
    setShowDropdown(false);
  };

  // Clear selection and reset
  const handleClear = () => {
    setSelectedCustomer(null);
    setCustomerMode(null);
    setValue("customerId", "");
    setValue("phoneNumber", "");
  };

  // Handle input text change — update search text for filtering
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setShowDropdown(value.trim().length > 0);

    // If user clears the input, reset selection
    if (!value.trim()) {
      handleClear();
    }
  };

  return (
    <div className="space-y-12">
      {/* ─── Customer Name Input ─── */}
      <div>
        <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
          Customer Name
        </label>
        <div
          className="relative"
          onBlur={(e) => {
            // Only close if focus leaves the entire wrapper
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setShowDropdown(false);
            }
          }}
        >
          <input
            type="text"
            placeholder="Type customer name..."
            aria-invalid={errors.customerName ? "true" : "false"}
            className={`${inputBase} ${errors.customerName ? inputErr : inputOk}`}
            {...register("customerName")}
            onChange={(e) => {
              register("customerName").onChange(e);
              handleInputChange(e);
            }}

          />

          {/* ─── Dropdown: matching existing customers ─── */}
          {showDropdown && matchingCustomers.length > 0 && (
            <div className="absolute z-10 mt-2 w-full rounded-input border border-border-default bg-white shadow-lg max-h-200 overflow-y-auto">
              {matchingCustomers.map((customer) => (
                <div
                  key={customer.customerId}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(customer);
                  }}
                  className="flex w-full items-center justify-between px-16 py-10 cursor-pointer hover:bg-surface-muted transition-colors"
                >
                  <div>
                    <p className="text-body-normal font-medium text-text-primary">
                      {customer.customerName}
                    </p>
                    <p className="text-body-small text-text-muted">
                      {customer.phoneNumber}
                    </p>
                  </div>
                  {selectedCustomer?.customerId === customer.customerId && (
                    <Check className="h-14 w-14 text-brand-primary" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {errors.customerName && (
          <p className="mt-4 text-body-small text-danger-main">
            {errors.customerName.message}
          </p>
        )}
      </div>

      {/* ─── Selected existing customer info ─── */}
      {customerMode === true && selectedCustomer && (
        <div className="rounded-input border border-brand-subtle bg-brand-tint px-16 py-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-normal font-medium text-text-primary">
                {selectedCustomer.customerName}
              </p>
              <p className="text-body-small text-text-secondary">
                {selectedCustomer.phoneNumber}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-body-small text-brand-primary hover:text-brand-hover transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* ─── No matches found — show "Create new" prompt ─── */}
      {customerMode === null && !selectedCustomer && searchText.trim().length > 0 && matchingCustomers.length === 0 && (
          <button
            type="button"
            onClick={handleCreateNew}
            className="flex w-full items-center gap-10 rounded-input border border-dashed border-brand-subtle bg-brand-tint/50 px-16 py-12 text-body-normal font-medium text-brand-primary hover:bg-brand-tint transition-colors"
          >
            <UserPlus className="h-16 w-16" />
            Create new customer &ldquo;{searchText}&rdquo;
          </button>
        )}

      {/* ─── New customer fields (inline expansion) ─── */}
      {customerMode === false && (
        <div className="space-y-12 rounded-input border border-brand-subtle bg-brand-tint/30 p-16">
          <div className="flex items-center gap-8">
            <UserPlus className="h-14 w-14 text-brand-primary" />
            <p className="text-body-normal font-medium text-brand-primary">
              New customer — {selectedCustomer?.customerName || searchText}
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="ml-auto text-body-small text-brand-primary hover:text-brand-hover transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Phone Number (required for new customers) */}
          <div>
            <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
              Phone Number <span className="text-danger-main">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. +263 77 123 4567"
              aria-invalid={errors.phoneNumber ? "true" : "false"}
              className={`${inputBase} ${errors.phoneNumber ? inputErr : inputOk}`}
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (<p className="mt-4 text-body-small text-danger-main">{errors.phoneNumber.message}</p>)}
          </div>
        </div>
      )}
    </div>
  );
}
