import { useState } from "react";
import { KeyRound, LogOut, ShieldCheck, Trash2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AccountSection from "../../components/account/AccountSection";
import { useAuth } from "../../auth/useAuth";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useInterviewMetrics } from "../../hooks/useInterviewMetrics";
import {
  changePassword,
  forceRefreshSession,
  logout,
  updateDisplayNameAttribute,
} from "../../services/auth";
import {
  DISPLAY_NAME_MAX_LENGTH,
  performDisplayNameUpdate,
  validateDisplayName,
} from "../../utils/account";
import {
  getProfileDisplayName,
  getProfileInitials,
} from "../../utils/profileDropdown";

export default function ProfilePage() {
  const profile = useCurrentUser();
  const { refreshAuth } = useAuth();
  const navigate = useNavigate();
  const { metrics, isLoading, error: metricsError } = useInterviewMetrics();
  const displayName = getProfileDisplayName(profile.displayName, profile.email);
  const initials = getProfileInitials(displayName);
  const [name, setName] = useState(displayName);
  const [nameError, setNameError] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const methodLabel =
    profile.signInMethod === "google"
      ? "Google"
      : profile.signInMethod === "email"
        ? "Email and password"
        : "Unknown";
  const metricCards = [
    ["Total interviews", metrics?.totalInterviews ?? 0],
    ["Average score", `${metrics?.averageScore ?? 0}/10`],
    ["Best score", `${metrics?.bestScore ?? 0}/10`],
    ["Current streak", `${metrics?.currentStreak ?? 0} days`],
  ];

  async function handleNameSubmit(event: React.FormEvent) {
    event.preventDefault();
    const validation = validateDisplayName(name);
    setNameError(validation.error);
    setSaveStatus("");
    if (validation.error) return;

    setIsSaving(true);
    try {
      const updatedName = await performDisplayNameUpdate(
        validation.name,
        updateDisplayNameAttribute,
        forceRefreshSession,
        () => refreshAuth({ showLoading: false })
      );
      setName(updatedName);
      setSaveStatus("Display name updated.");
    } catch {
      setNameError("Your display name could not be updated. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPasswordError("");
    setPasswordStatus("");
    if (!oldPassword || newPassword.length < 8) {
      setPasswordError("Enter your current password and a new password of at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(oldPassword, newPassword);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStatus("Password changed successfully.");
    } catch {
      setPasswordError("Your password could not be changed. Check your current password and try again.");
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleSignOut() {
    await logout();
    navigate("/");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Profile</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Manage your visible account details and review your progress.
        </p>
      </header>

      <AccountSection title="Account details">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {profile.picture && !avatarFailed ? (
            <img
              src={profile.picture}
              alt={`${displayName} profile`}
              className="h-24 w-24 rounded-full object-cover shadow-md"
              referrerPolicy="no-referrer"
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-2xl font-bold text-white shadow-md">
              {initials || <User aria-hidden="true" />}
            </div>
          )}
          <dl className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2">
            <div className="min-w-0"><dt className="text-sm text-slate-500">Display name</dt><dd className="mt-1 break-words font-semibold text-slate-900 dark:text-slate-100">{displayName}</dd></div>
            <div className="min-w-0"><dt className="text-sm text-slate-500">Email</dt><dd className="mt-1 break-all font-semibold text-slate-900 dark:text-slate-100">{profile.email}</dd></div>
            <div><dt className="text-sm text-slate-500">Sign-in method</dt><dd className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{methodLabel}</dd></div>
          </dl>
        </div>
        <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {profile.signInMethod === "google"
            ? "Your verified email and profile picture are managed by Google through Cognito."
            : "Your email remains read-only in InterviewAce AI v1 and is managed through Cognito."}
        </p>
      </AccountSection>

      <AccountSection title="Edit profile" description="Your display name appears throughout InterviewAce AI.">
        <form onSubmit={handleNameSubmit} className="max-w-xl">
          <label className="block font-medium text-slate-800 dark:text-slate-200" htmlFor="display-name">Display name</label>
          <input id="display-name" value={name} maxLength={DISPLAY_NAME_MAX_LENGTH + 10} onChange={(event) => { setName(event.target.value); setNameError(""); setSaveStatus(""); }} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
          <div className="mt-2 flex justify-between gap-4 text-sm"><span className={nameError ? "text-rose-600" : "text-emerald-600"} role="status">{nameError || saveStatus}</span><span className="text-slate-400">{name.trim().length}/{DISPLAY_NAME_MAX_LENGTH}</span></div>
          <button type="submit" disabled={isSaving || name.trim() === displayName} className="mt-4 min-h-11 rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{isSaving ? "Saving…" : "Save changes"}</button>
        </form>
      </AccountSection>

      <AccountSection title="Interview statistics" description="Calculated from your real completed interview history.">
        {metricsError ? <p className="rounded-xl bg-amber-50 p-4 text-amber-800">{metricsError}</p> : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metricCards.map(([label, value]) => <div key={label} className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{isLoading ? "—" : value}</p></div>)}</div>
        )}
      </AccountSection>

      <AccountSection title="Account security" description="Security actions are handled by your Cognito sign-in method.">
        <div className="space-y-6">
          {profile.signInMethod === "email" ? (
            <form onSubmit={handlePasswordSubmit} className="max-w-xl space-y-3">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100"><KeyRound className="h-5 w-5" />Change password</div>
              <input type="password" autoComplete="current-password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Current password" className="min-h-11 w-full rounded-xl border border-slate-300 px-4 dark:border-slate-600 dark:bg-slate-800" />
              <input type="password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" className="min-h-11 w-full rounded-xl border border-slate-300 px-4 dark:border-slate-600 dark:bg-slate-800" />
              <input type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="min-h-11 w-full rounded-xl border border-slate-300 px-4 dark:border-slate-600 dark:bg-slate-800" />
              <p role="status" className={passwordError ? "text-sm text-rose-600" : "text-sm text-emerald-600"}>{passwordError || passwordStatus}</p>
              <button type="submit" disabled={isChangingPassword} className="min-h-11 rounded-xl border border-blue-200 px-5 font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50">{isChangingPassword ? "Changing…" : "Change password"}</button>
            </form>
          ) : profile.signInMethod === "google" ? (
            <div className="flex gap-3 rounded-2xl bg-blue-50 p-4 text-sm text-blue-900"><ShieldCheck className="h-5 w-5 shrink-0" /><p>Your password and recovery options are managed by Google.</p></div>
          ) : <p className="text-sm text-slate-600">Password changes are unavailable because the sign-in method could not be determined safely.</p>}
          <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row">
            <button type="button" onClick={() => void handleSignOut()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 px-5 font-semibold text-rose-700 hover:bg-rose-50"><LogOut className="h-5 w-5" />Sign out from this device</button>
            <button type="button" disabled className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 font-semibold text-slate-500 disabled:cursor-not-allowed"><Trash2 className="h-5 w-5" />Delete Account — Coming Soon</button>
          </div>
        </div>
      </AccountSection>
    </div>
  );
}
