import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Shield, Eye, MoreVertical } from "lucide-react";
import { useGetAllUsers, useGetAllOrders, useUpdateUserRole, useDeleteUser, useGetCurrentUserRole } from "@/hooks/InventoryHooks";
import ConfirmUserDeleteModal from "./ConfirmUserDeleteModal";
import { formatDate } from "@/utils/dateUtils";

const ROLE_OPTIONS = ["USER", "MANAGER", "ADMIN"];

const ROLE_COLORS = {
  ADMIN: "text-purple-600",
  MANAGER: "text-blue-600",
  USER: "text-gray-600",
};

export default function Users() {
  // ─── State ──────────────────────────────────────────────────
  // We store the dynamic pixel coordinates of the clicked 3-dot button.
  // Since only one popover can be open at a time (thanks to popover="auto"),
  // we only need a single state object to position the active popover.
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [selectedUser, setSelectedUser] = useState(null);
  const deleteUserDialogRef = useRef(null);

  // ─── Hooks ──────────────────────────────────────────────────
  const navigate = useNavigate();
  const { data: users, isLoading, isError, error } = useGetAllUsers();
  const { data: orders = [] } = useGetAllOrders();
  const { data: currentRole } = useGetCurrentUserRole();
  const { mutate: updateUserRole } = useUpdateUserRole();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  // Sort users by createdAt descending (most recent first)
  const sortedUsers = useMemo(() => {
    if (!users) return [];
    return [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [users]);

  // ─── Functions ──────────────────────────────────────────────
  const handleOpenMenu = (e) => {
    // e.currentTarget is the button that was clicked.
    // getBoundingClientRect() gives us its exact position on the viewport.
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Position the popover slightly below the clicked button, accounting for page scroll.
    setMenuPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.right - 224 + window.scrollX, // 224px matches the w-56 width of our dropdown
    });
  };

  const handleRoleChange = (userId, newRole) => {
    updateUserRole({ id: userId, userRole: newRole });
    // After performing the action, manually close the native popover
    const popover = document.getElementById(`menu-${userId}`);
    if (popover) {
      popover.hidePopover();
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedUser) return;
    deleteUser(selectedUser.userId, {
      onSuccess: () => { setSelectedUser(null); deleteUserDialogRef.current?.close(); },
      onError: () => { setSelectedUser(null); deleteUserDialogRef.current?.close(); },
    });
  };

  const getOrderCount = (userName) => {
    return orders.filter(o => o.createdBy === userName).length;
  };

  // ─── Render ─────────────────────────────────────────────────
  if (currentRole !== "ADMIN") {
    return (
      <div className="animate-fade-in">
        {/* ── Access Denied ─── */}
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-32 shadow-elevation-1 text-center">
          <Shield className="h-32 w-32 text-text-muted mb-16" />
          <h3 className="text-h4 font-semibold text-text-primary">Access Denied</h3>
          <p className="mt-8 text-body-normal text-text-muted">You need admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in mx-auto max-w-7xl">
      {/* ── Page Header ─── */}
      <div className="mb-32 flex flex-col gap-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h2 font-bold text-text-primary">User Management</h1>
          <p className="mt-8 text-body-normal text-text-secondary">
            Manage user accounts and roles
          </p>
        </div>
      </div>

      {/* ── Error Banner ─── */}
      {isError && (
        <div className="mb-20 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-normal text-danger-main animate-fade-in">
          {error.response?.data?.message || "Failed to load users."}
        </div>
      )}

      {/* ── Loading State ─── */}
      {isLoading && (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-16 rounded-card bg-surface-default shadow-elevation-1 animate-fade-in">
          <Loader2 className="h-32 w-32 animate-spin text-brand-primary" />
          <p className="text-body-normal text-text-secondary">Loading users...</p>
        </div>
      )}

      {/* ── Empty State ─── */}
      {!isLoading && !isError && sortedUsers.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-card bg-surface-default p-32 shadow-elevation-1 text-center animate-fade-in">
          <Shield className="h-32 w-32 text-brand-primary mb-16" />
          <h3 className="text-h4 font-semibold text-text-primary">No users yet</h3>
        </div>
      )}

      {/* ── Users Table ─── */}
      {!isLoading && sortedUsers.length > 0 && (
        <div className="w-full rounded-card bg-surface-default overflow-visible">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default">
                <th className="min-w-[160px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Name</th>
                <th className="min-w-[200px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Email</th>
                <th className="min-w-[140px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Phone</th>
                <th className="min-w-[100px] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">Role</th>
                <th className="w-28 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Orders</th>
                <th className="w-36 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted whitespace-nowrap">Joined</th>
                <th className="w-20 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((u) => (
                <tr
                  key={u.userId}
                  className="border-b border-border-default/50 last:border-b-0 hover:bg-surface-muted/40 transition-colors duration-150"
                >
                  <td className="min-w-[160px] px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                    {u.userName}
                  </td>
                  <td className="min-w-[200px] px-6 py-4 text-text-secondary whitespace-nowrap truncate">
                    {u.userEmail}
                  </td>
                  <td className="min-w-[140px] px-6 py-4 text-text-secondary whitespace-nowrap">
                    {u.userPhoneNumber}
                  </td>
                  <td className={`min-w-[100px] px-6 py-4 text-xs font-medium whitespace-nowrap ${ROLE_COLORS[u.userRole] || "text-gray-600"}`}>
                    {u.userRole}
                  </td>
                  <td className="w-28 px-6 py-4 text-text-primary text-right whitespace-nowrap tabular-nums">
                    {getOrderCount(u.userName)}
                  </td>
                  <td className="w-36 px-6 py-4 text-xs text-text-muted whitespace-nowrap">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="w-20 px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-4">
                      {/* View details */}
                      <button
                        onClick={() => navigate(`/admin/users/${u.userId}`)}
                        className="rounded-full p-5 text-text-muted hover:bg-brand-subtle hover:text-brand-primary transition-all duration-200 press-scale"
                        aria-label={`View ${u.userName}`}
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      {/* Action trigger button using Popover Target */}
                      <button
                        popovertarget={`menu-${u.userId}`}
                        onMouseDown={(e) => e.preventDefault()} // prevent focus leaving
                        onClick={handleOpenMenu} // set location dynamically
                        className="rounded-full p-5 text-text-muted hover:bg-surface-muted hover:text-text-primary transition-all duration-200 press-scale"
                        aria-label="Actions"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {/* Native HTML5 Popover Menu */}
                      {/* popover="auto" makes the menu render in the "Top Layer" completely outside */}
                      {/* the normal page flow, escaping any overflow clipping from the table. */}
                      <div
                        id={`menu-${u.userId}`}
                        popover="auto"
                        style={{
                          position: "absolute",
                          top: menuPos.top,
                          left: menuPos.left,
                          margin: 0,
                        }}
                        className="w-56 whitespace-nowrap rounded-input border border-border-default bg-surface-default py-4 shadow-elevation-2 focus-visible:outline-none"
                      >
                        {ROLE_OPTIONS.filter(r => r !== u.userRole).map((role) => (
                          <button
                            key={role}
                            onClick={() => handleRoleChange(u.userId, role)}
                            className="flex w-full items-center gap-8 px-16 py-8 text-left text-body-small leading-none text-text-primary hover:bg-surface-muted transition-colors"
                          >
                            Set as {role}
                          </button>
                        ))}
                        <div className="my-2 border-t border-border-default" />
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            // Close the native popover since we are opening a separate modal
                            document.getElementById(`menu-${u.userId}`).hidePopover();
                            // Open the dialog after state updates
                            setTimeout(() => deleteUserDialogRef.current?.showModal(), 0);
                          }}
                          className="flex w-full items-center px-16 py-8 text-left text-body-small leading-none text-danger-main hover:bg-danger-bg transition-colors"
                        >
                          Delete User
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─── */}
      {selectedUser && (
        <ConfirmUserDeleteModal
          dialogRef={deleteUserDialogRef}
          userName={selectedUser.userName}
          onConfirm={handleDeleteConfirm}
          onCancel={() => { setSelectedUser(null); deleteUserDialogRef.current?.close(); }}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
