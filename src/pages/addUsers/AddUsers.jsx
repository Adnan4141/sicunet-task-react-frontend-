import { useState } from "react";
import { addUser } from "../../api/users";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddUser() {
  const auth = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    birthDate: "",
    weight: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const birthDate = new Date(form.birthDate);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    if (age < 18) {
      toast.error("User must be at least 18 years old.");
      return;
    }

    try {
      await addUser(auth.token, form);
      toast.success("User added successfully!");
      navigate("/users");
    } catch (err) {
      toast.error("Failed to add user.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8">
       
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Add New User</h2>
          <button
            onClick={() => navigate("/users")}
            className="px-4 py-2 cursor-pointer bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            ← Back to Users
          </button>
        </div>

  
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              name="weight"
              type="number"
              value={form.weight}
              onChange={handleChange}
              min="1"
              max="300"
              step="0.1"
              placeholder="Weight"
              required
              className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Image URL"
              required
              className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="px-10 py-3 cursor-pointer bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold text-lg"
            >
              ➕ Add User
            </button>
          </div>
        </form>

    
        {form.image && (
          <div className="mt-8 flex justify-center">
            <img
              src={form.image}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
