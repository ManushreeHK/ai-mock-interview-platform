import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  const { status, profile } = useAuth();
  const location = useLocation();
  const [sidebarState, setSidebarState] = useState({ open: false, path: location.pathname });
  const sidebarOpen = sidebarState.open && sidebarState.path === location.pathname;
  const closeSidebar = () => setSidebarState({ open: false, path: location.pathname });

  useEffect(() => {
    if (!sidebarOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSidebarState({ open: false, path: location.pathname });
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [location.pathname, sidebarOpen]);

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
    <div className="flex min-h-screen min-w-0 bg-slate-50 dark:bg-slate-950">
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setSidebarState({ open: true, path: location.pathname })} />

        <main className="min-w-0 flex-1 p-3 sm:p-5 lg:p-6 xl:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
