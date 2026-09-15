import React, { useState, useEffect } from "react";
import { 
  Users as UsersIcon, 
  Search, 
  UserPlus, 
  Mail, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  XCircle,
  Loader2,
  X,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State for Editing User
  const [editingUser, setEditingUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Modal States for Deleting User
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);

  // Custom Toast Style Options
  const toastOptions = {
    duration: 3000,
    style: {
      background: "#163A2D",
      color: "#FDE68A", // Amber-200
      fontSize: "14px",
      fontWeight: "600",
      borderRadius: "12px",
      padding: "12px 16px",
      boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)",
    },
  };

  // Fetch Users Data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
      setError("");
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load users from the server.");
      toast.error("Could not load user data!", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete User Confirmation & Execution
  const confirmDelete = async () => {
    if (!deletingUser) return;
    const id = deletingUser._id || deletingUser.id;
    setIsDeleting(true);

    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers((prevUsers) => prevUsers.filter((user) => (user._id || user.id) !== id));
      
      setDeletingUser(null);
      setShowDeleteSuccessModal(true);
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Failed to delete user!", toastOptions);
    } finally {
      setIsDeleting(false);
    }
  };

  // Update User Handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const userId = editingUser._id || editingUser.id;
    const lowercasedRole = editingUser.role ? editingUser.role.toLowerCase() : "user";

    try {
      const response = await fetch(`http://localhost:3000/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: editingUser.fullName || editingUser.name,
          email: editingUser.email,
          role: lowercasedRole,
        }),
      });

      if (!response.ok) throw new Error("Failed to update user");

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          (u._id || u.id) === userId
            ? { ...editingUser, role: lowercasedRole }
            : u
        )
      );

      setEditingUser(null);
      toast.success("User updated successfully! 🎉", toastOptions);
    } catch (err) {
      console.error("Update Error:", err);
      toast.error("Failed to update user details!", toastOptions);
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter Users
  const filteredUsers = users.filter((user) => {
    const name = user.fullName || user.name || "";
    const email = user.email || "";
    const role = user.role || "";
    const query = searchTerm.toLowerCase();

    return (
      name.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query) ||
      role.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto bg-[#F8FAFC] font-sans space-y-8 p-4 sm:p-6 lg:pr-16">
      
      {/* Toast Notification Container */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#163A2D] text-amber-300 rounded-xl shadow-md">
            <UsersIcon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
              User Management
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Manage system access, roles, and administrative permissions.
            </p>
          </div>
        </div>

        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md">
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Users</p>
            <h3 className="text-2xl font-bold text-[#163A2D] mt-1">{users.length}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <UsersIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admins / Super Admins</p>
            <h3 className="text-2xl font-bold text-[#163A2D] mt-1">
              {users.filter((u) => u.role?.toLowerCase().includes("admin")).length}
            </h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Regular Users</p>
            <h3 className="text-2xl font-bold text-[#163A2D] mt-1">
              {users.filter((u) => u.role?.toLowerCase() === "user").length}
            </h3>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 transition-colors"
            />
          </div>
          <span className="text-xs text-gray-400 font-medium">
            Showing {filteredUsers.length} of {users.length} users
          </span>
        </div>

        {/* User Data Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-emerald-800 gap-2 font-medium">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              Loading users...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500 font-medium text-sm">{error}</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-950 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                  <th className="p-4">User Details</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-gray-700">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const userId = user._id || user.id;
                    const displayName = user.fullName || user.name || "User";
                    const profileImg = user.image || user.photoURL;

                    return (
                      <tr key={userId} className="hover:bg-emerald-50/40 transition-colors">
                        
                        {/* Avatar, Name & Email */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {profileImg ? (
                              <img
                                src={profileImg}
                                alt={displayName}
                                className="w-9 h-9 rounded-full object-cover border border-emerald-200 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-[#163A2D] text-amber-300 font-bold flex items-center justify-center shrink-0 uppercase">
                                {displayName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">{displayName}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3 text-emerald-600" />
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 capitalize">
                            <ShieldCheck className="w-3 h-3" />
                            {user.role || "user"}
                          </span>
                        </td>

                        {/* Created Date */}
                        <td className="p-4 text-gray-500">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                              title="Edit User"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingUser(user)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-400 text-sm">
                      No users found matching "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative border border-emerald-100">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-[#163A2D] mb-4">Edit User Details</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingUser.fullName || editingUser.name || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, fullName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editingUser.email || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                  Role
                </label>
                <select
                  value={editingUser.role?.toLowerCase() || "user"}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 capitalize"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl relative border border-rose-100 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">Delete User?</h3>
            <p className="text-xs text-gray-500 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-800">{deletingUser.fullName || deletingUser.name || "this user"}</span>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="w-full py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE SUCCESSFUL MODAL */}
      {showDeleteSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl relative border border-emerald-100 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">User Deleted!</h3>
            <p className="text-xs text-gray-500 mb-6">
              The user has been successfully removed from the database.
            </p>

            <button
              type="button"
              onClick={() => setShowDeleteSuccessModal(false)}
              className="w-full py-2.5 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 text-xs font-semibold rounded-xl transition-colors shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Users;