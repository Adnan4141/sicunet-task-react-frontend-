import { useEffect, useState } from "react";
import { fetchUsers } from "../../api/users";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const auth = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const [limit] = useState(5); 
  const [total, setTotal] = useState(0);

  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("desc");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) return;
    setLoading(true);
    fetchUsers(auth.token, { limit, skip: page * limit, sortBy, order })
      .then((data) => {
        setUsers(data.users || []);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [auth, page, limit, sortBy, order]);

  const filtered = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Users</h2>

      {/* Sorting  part*/}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by first name or email"
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-1/3"
        />

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="id">ID</option>
            <option value="firstName">First Name</option>
            <option value="age">Age</option>
            <option value="email">Email</option>
          </select>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* *******-------Users Table-----------********** */}
      <div className="overflow-x-auto rounded-lg shadow-lg relative">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg
              className="animate-spin h-10 w-10 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 font-medium">
            No users found.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                  Birthdate
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                  Weight
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                  Image
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => navigate(`/users/${u.id}`)}
                  className="hover:bg-indigo-50 cursor-pointer transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{u.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.birthDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.weight.toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={u.image}
                      alt={u.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-center items-center mt-6 gap-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-lg disabled:bg-gray-300 hover:bg-indigo-700 transition"
        >
          Prev
        </button>
        <span className="text-gray-700 font-medium">
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
          disabled={page + 1 >= totalPages}
          className="px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-lg disabled:bg-gray-300 hover:bg-indigo-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
