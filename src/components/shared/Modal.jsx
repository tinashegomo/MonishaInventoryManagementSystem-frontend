import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

/**
 * Modal — shared wrapper for all <dialog>-based modals.
 *
 * Handles:
 *   - Attaching the ref to the <dialog> element
 *   - Syncing open/close with the `isOpen` prop (via useEffect)
 *   - Listening for the native "close" event (ESC, backdrop click)
 *   - Exposing `.showModal()` and `.close()` via imperative handle
 *
 * The parent does NOT need to manage open/close useEffect — just pass
 * isOpen + onClose and call the imperative methods when needed.
 *
 * Props:
 *   isOpen   — boolean, controls whether the dialog is open
 *   onClose  — callback, fired when dialog closes (ESC, backdrop, .close())
 *   children — modal content (forms, messages, buttons)
 *   className — optional, applied to the <dialog> element for styling
 *
 * Usage:
 *   const dialogRef = useRef(null);
 *
 *   <Modal ref={dialogRef} isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *     <h2>Title</h2>
 *     <p>Content</p>
 *     <button onClick={() => setIsOpen(false)}>Close</button>
 *   </Modal>
 */
const Modal = forwardRef(function Modal({ isOpen, onClose, children, className = "" }, ref) {
  const dialogRef = useRef(null);

  // Expose .showModal() and .close() so the parent can call them directly
  // via dialogRef.current.showModal() / dialogRef.current.close()
  useImperativeHandle(ref, () => ({
    showModal: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  // ─── Sync React state (isOpen) with native dialog open/close ──
  // When isOpen becomes true, call the native .showModal() method.
  // When isOpen becomes false, call the native .close() method.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  // ─── Listen for native "close" event ─────────────────────────
  // The browser fires "close" when the user presses ESC, clicks the
  // backdrop, or when .close() is called programmatically.
  // We forward this to the parent's onClose callback so it can reset
  // its state (e.g., setIsOpen(false), setSelectedUser(null)).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog ref={dialogRef} className={className}>
      {children}
    </dialog>
  );
});

export default Modal;
