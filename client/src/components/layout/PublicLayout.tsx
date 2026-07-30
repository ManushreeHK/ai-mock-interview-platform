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
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default PublicLayout;
