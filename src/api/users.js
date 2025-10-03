import axiosClient from "./axiosClient";

// ✅ Unified API functions
export async function fetchUsers({ limit = 5, skip = 0, sortBy = "id", order = "desc" } = {}) {
  try {
    const res = await axiosClient.get(`/users`, { params: { limit, skip, sortBy, order } });

    return res.data;
  } catch (err) {
    console.log(err)
    throw new Error(err.response?.data?.message || "Failed to fetch users");
  }
}

export async function fetchUser(id) {
  try {
    const res = await axiosClient.get(`/users/${id}`);
    return res.data;
  } catch (err) {
    console.log(err)
    throw new Error(err.response?.data?.message || "Failed to fetch user");
  }
}

export async function addUser(data) {
  try {
    const res = await axiosClient.post(`/users/add`, data);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to add user");
  }
}

export async function updateUser(id, data) {
  try {
    const res = await axiosClient.put(`/users/${id}`, data);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update user");
  }
}

export async function deleteUser(id) {
  try {
    const res = await axiosClient.delete(`/users/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete user");
  }
}