import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUser, updateUser, deleteUser } from "../../api/users";
import { toast } from "react-toastify";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.user);

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth) return;
    fetchUser(auth.token, id)
      .then(setUser)
      .catch(() => {
        setError("Failed to fetch user");
      });
  }, [id, auth]);

  if (!user)
    return <p className="text-gray-500 text-center mt-10">Loading user...</p>;

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser(auth.token, id, user);
      toast.success("User updated ");
    } catch (err) {
      setError("Update failed");
    }
  };

  const handleDelete = async () => {
    if (user.id === auth.id) {
      toast.success("You cannot delete your own account.");
      return;
    }
    try {
      await deleteUser(auth.token, id);
      toast.success("User deleted ");
      navigate("/users");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Back Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit User: {user.username}
          </h2>
          <button
            onClick={() => navigate("/users")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            ← Back to Users
          </button>
        </div>

        {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="username"
              value={user.username || ""}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              name="password"
              type="password"
              value={user.password || ""}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              name="email"
              type="email"
              value={user.email || ""}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              name="birthDate"
              type="date"
              value={user.birthDate || ""}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              name="weight"
              type="number"
              value={user.weight || ""}
              onChange={handleChange}
              min="1"
              max="300"
              step="0.1"
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              name="image"
              value={user.image || ""}
              onChange={handleChange}
              placeholder="Image URL"
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col md:flex-row md:justify-between gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete User
            </button>
          </div>
        </form>

        {user.image && (
          <div className="mt-6 flex justify-center">
            <img
              src={user.image}
              alt={user.username}
              className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
