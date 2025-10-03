import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Users, UserPlus } from "lucide-react"; // icons
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../redux/feature/authSlice";


const sidebarLinks = [
  { name: "Users", path: "/users", icon: Users },
  { name: "Add User", path: "/add", icon: UserPlus },
];

const DashboardLayout = () => {
 const dispatch = useDispatch();


  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.user); // dynamic user info

  const handleLogout = async () => {
    try {
      dispatch(logout())
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar************************** */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold tracking-wide">Admin Panel</h1>
        </div>

  
        <nav className="flex-1 p-4 space-y-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-gray-800 text-white font-semibold"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <Icon size={18} /> {link.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-3 w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content ----------------*/}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">
              Hello, {auth?.username || "Admin"}
            </span>
            <img
              src={auth?.image || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"}
              alt="avatar"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </header>


        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
