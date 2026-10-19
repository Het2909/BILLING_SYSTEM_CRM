import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import { protectedRoutes } from "./constants/routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {protectedRoutes.map(({ path, element: Page }) => (
            <Route key={path} path={path} element={<Page />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
