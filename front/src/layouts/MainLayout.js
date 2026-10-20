import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout() {

  return (

    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 ml-64">

        <Navbar />

        <div className="p-6">

          <Outlet />

        </div>

      </div>

    </div>
  );
}

export default MainLayout;
