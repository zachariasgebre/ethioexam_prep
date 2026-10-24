"use client";

import { useState, useTransition } from "react";
import { setUserRole, toggleUserPaidStatus } from "@/lib/actions/admin";

interface AdminToggleAccessProps {
  targetUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    hasPaid: boolean;
  };
  isCurrentUser: boolean;
}

export function AdminToggleAccess({ targetUser, isCurrentUser }: AdminToggleAccessProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleTogglePaid() {
    setErrorMessage(null);
    setSuccessMessage(null);
    startTransition(async () => {
      const nextPaidState = !targetUser.hasPaid;
      const res = await toggleUserPaidStatus(targetUser.id, nextPaidState);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage(`Subscription ${nextPaidState ? "activated" : "revoked"}`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    });
  }

  function handleRoleChange(newRole: "admin" | "user") {
    if (newRole === targetUser.role) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    startTransition(async () => {
      const res = await setUserRole(targetUser.id, newRole);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage(`Role updated to ${newRole}`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        {/* Paid Status Toggle */}
        <button
          type="button"
          onClick={handleTogglePaid}
          disabled={isPending}
          className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
            targetUser.hasPaid
              ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
              : "bg-emerald-700 text-white hover:bg-emerald-800"
          }`}
          aria-label={`${targetUser.hasPaid ? "Revoke" : "Grant"} paid access for ${targetUser.name}`}
        >
          {targetUser.hasPaid ? "Revoke Paid Access" : "Grant Paid Access"}
        </button>

        {/* Role Switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          <button
            type="button"
            onClick={() => handleRoleChange("user")}
            disabled={isPending || targetUser.role === "user" || isCurrentUser}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
              targetUser.role === "user"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title={isCurrentUser ? "You cannot modify your own role" : "Set role to User"}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("admin")}
            disabled={isPending || targetUser.role === "admin"}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
              targetUser.role === "admin"
                ? "bg-purple-700 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Set role to Admin"
          >
            Admin
          </button>
        </div>
      </div>

      {/* Inline Feedback */}
      {errorMessage && (
        <p role="alert" className="text-xs font-medium text-rose-600">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p role="status" className="text-xs font-medium text-emerald-700">
          {successMessage}
        </p>
      )}
    </div>
  );
}

