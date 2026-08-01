import { Outlet } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  const { status, profile } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <p className="mt-4 font-medium text-slate-600 dark:text-slate-300">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return <Outlet />;
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
        <div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Unable to load your profile
          </h1>
          <p className="mt-3 text-slate-600">
            Please refresh the page or sign in again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
