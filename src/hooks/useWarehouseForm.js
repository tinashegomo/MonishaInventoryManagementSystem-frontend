import { useState } from "react";

/**
 * useWarehouseForm — custom hook for warehouse batch creation form.
 *
 * Manages:
 * - Unique values extracted from existing batches (types, variants, colors)
 * - Suggestion pick handlers (set RHF value)
 * - Sizes array (plain React state)
 *
 * Note: Dropdown visibility is now handled natively by the HTML5 Popover API.
 * The browser manages showing/hiding the suggestion lists, so no React state
 * is needed for visibility (showTypes, showVariants, showColors removed).
 *
 * Receives RHF's `setValue` from the component.
 */
export const useWarehouseForm = ({ batches = [], setValue }) => {

  // ─── State: sizes array ──────────────────────────────────────
  // Tracks the list of { size, quantity } pairs added by the user.
  const [sizes, setSizes] = useState([]);

  // ─── Computed Values: unique values from existing batches ────
  // Extracts distinct type, variant, and color values from all batches
  // to populate the suggestion dropdowns.
  const types = [...new Set(batches.map((batch) => batch.type))];
  const variants = [...new Set(batches.map((batch) => batch.variant))];
  const colors = [...new Set(batches.map((batch) => batch.color))];

  // ─── Functions: suggestion pick handlers ─────────────────────
  // These are called when the user clicks a suggestion in the popover.
  // They set the RHF field value. The browser handles hiding the popover
  // automatically via light-dismiss (click outside closes it).

  const handleTypeSelect = (type) => {
    setValue("type", type);
  };

  const handleVariantSelect = (variant) => {
    setValue("variant", variant);
  };

  const handleColorSelect = (color) => {
    setValue("color", color);
  };

  // ─── Functions: size operations ──────────────────────────────

  // Add a new empty size row
  const addRow = () => {
    setSizes([...sizes, { size: "", quantity: "" }]);
  };

  // Remove a size row by index
  const removeRow = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  // Update a specific field (size or quantity) in a row
  const updateRow = (index, field, value) => {
    const updated = [...sizes];
    updated[index] = { ...updated[index], [field]: value };
    setSizes(updated);
  };

  // ─── Return ──────────────────────────────────────────────────
  return {
    // Unique values from batches (used as suggestion options)
    types,
    variants,
    colors,
    // Suggestion pick handlers
    handleTypeSelect,
    handleVariantSelect,
    handleColorSelect,
    // Sizes state + operations
    sizes,
    addRow,
    removeRow,
    updateRow,
  };
};
