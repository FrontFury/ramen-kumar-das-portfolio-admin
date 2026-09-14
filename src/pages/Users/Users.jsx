import React, { useState } from "react";
import { 
  Users as UsersIcon, 
  Search, 
  UserPlus, 
  Mail, 
  ShieldCheck, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle 
} from "lucide-react";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample User Data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Ramen Kumar Das",
      email: "rkdas.ict@gmail.com",
      role: "Super Admin",
      status: "Active",
      joinedDate: "Jan 12, 2024",
    },
    {
      id: 2,
      name: "Dr. Md. Rubaiyat Hossain Mondal",
      email: "rubaiyat97@iict.buet.ac.bd",
      role: "Editor",
      status: "Active",
      joinedDate: "Feb 05, 2024",
    },
    {
      id: 3,
      name: "Dr. Kamruzzaman Khan",
      email: "k.khanru@pust.ac.bd",
      role: "Viewer",
      status: "Inactive",
      joinedDate: "Mar 18, 2024",
    },
  ]);

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans space-y-8">
      
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
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Admins</p>
            <h3 className="text-2xl font-bold text-[#163A2D] mt-1">
              {users.filter((u) => u.status === "Active").length}
            </h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Inactive Accounts</p>
            <h3 className="text-2xl font-bold text-[#163A2D] mt-1">
              {users.filter((u) => u.status === "Inactive").length}
            </h3>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
        
        {/* Search Bar Bar */}
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-950 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <th className="p-4">User Details</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-gray-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-emerald-50/40 transition-colors">
                    
                    {/* Name & Email */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#163A2D] text-amber-300 font-bold flex items-center justify-center shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-emerald-600" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" />
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {user.status === "Active" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-400 font-semibold text-xs">
                          <XCircle className="w-3.5 h-3.5" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-gray-500">{user.joinedDate}</td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="Edit User"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400 text-sm">
                    No users matching "{searchTerm}" found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default Users;