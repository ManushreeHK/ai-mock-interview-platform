import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";

function AppLayout() {
  return (
    <>
      <AppNavbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </>
  );
}

export default AppLayout;