import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Users from "./pages/users/Users";
import AddUser from "./pages/addUsers/AddUsers";
import UserDetails from "./pages/userDetails/UserDetails";
import Login from "./pages/login/Login";
import NotFound from "./components/shared/NotFound"; 
import PrivateRoute from "./components/privateRoute/PrivateRoute";

import { ToastContainer } from "react-toastify";
import DashboardLayout from "./components/dashboardLayout/DashboardLayout";

const App = () => {
  const token = useSelector((state) => state.auth.token);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<Users />} />
          <Route path="add" element={<AddUser />} />
          <Route path="users/:id" element={<UserDetails />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer />
    </div>
  );
};

export default App;
