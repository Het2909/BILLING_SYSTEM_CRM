import Billing from "../pages/Billing";
import Bills from "../pages/Bills";
import Customers from "../pages/Customers";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Purchases from "../pages/Purchases";
import Suppliers from "../pages/Suppliers";

export const protectedRoutes = [
  {
    path: "/",
    element: Dashboard,
  },
  {
    path: "/products",
    element: Products,
  },
  {
    path: "/billing",
    element: Billing,
  },
  {
    path: "/bills",
    element: Bills,
  },
  {
    path: "/customers",
    element: Customers,
  },
  {
    path: "/suppliers",
    element: Suppliers,
  },
  {
    path: "/purchases",
    element: Purchases,
  },
];
