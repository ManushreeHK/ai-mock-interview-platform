import { Outlet, useLocation } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";

function PublicLayout() {
  const { pathname } = useLocation();

  if (pathname === "/") {
    return <Outlet />;
  }

  return (
    <>
      <PublicNavbar />
      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default PublicLayout;
