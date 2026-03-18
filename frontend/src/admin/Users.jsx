import React, { useEffect, useState } from "react";
import axios from "axios";
import { GiCancel } from "react-icons/gi";
import Swal from "sweetalert2";
import "../Admin-Css-Folder/Users.css";

const Users = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [userShow, setUserShow] = useState([]);
  const [user, setUser] = useState({
    username: "",
    email: "",
    phonenumber: "",
    password: "",
    status: "",
    role: "",
  });

  const handleUser = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleEdit = (userData) => {
    setUser({
      username: userData.username,
      email: userData.email,
      phonenumber: userData.phonenumber,
      password: "", 
      status: userData.status || "",
      role: userData.role || "",
    });
    setEditUserId(userData.id);
    setIsEdit(true);
    setIsLogin(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      try {
        await axios.put(`http://localhost:5100/api/users/${editUserId}`, user);
        getUsers();
        resetForm();
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "User Updated Successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        // console.log("Error updating user:", err);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to update user",
        });
      }
    } else {
      try {
        if (
          !user.username ||
          !user.email ||
          !user.phonenumber ||
          !user.role ||
          !user.password
        ) {
          return Swal.fire({
            icon: "warning",
            title: "Required!",
            text: "All fields are required",
          });
        }
        await axios.post("http://localhost:5100/api/users", user);
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "User Added Successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        getUsers();
        resetForm();
      } catch (err) {
        console.error("Error creating user:", err);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to add user",
        });
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2e7d32",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5100/api/users/${id}`);
        Swal.fire("Deleted!", "User has been deleted.", "success");
        getUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        Swal.fire("Error", "Failed to delete user", "error");
      }
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5100/api/users");
      if (response.data && response.data.users) {
        setUserShow(response.data.users);
      }
    } catch (err) {
      // console.log("Fetching failed", err);
    }
  };

  const resetForm = () => {
    setIsLogin(true);
    setIsEdit(false);
    setEditUserId(null);
    setUser({
      username: "",
      email: "",
      phonenumber: "",
      role: "",
      status: "",
      password: "",
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="users-manager-container">
      <div className="users-manager-header">
        <h2>{isEdit ? "Edit User" : "Manage Users"}</h2>
        <button
          className="add-btn"
          onClick={() => (isLogin ? setIsLogin(false) : resetForm())}
        >
          {isLogin ? "Add New User" : "View All Users"}
        </button>
      </div>

      {isLogin ? (
        <div className="users-list-container">
          <div className="search-container">
            <input type="search" placeholder="Search users..." />
          </div>
          <table className="users-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userShow.length > 0 ? (
                userShow.map((user, index) => (
                  <tr key={user.id || index}>
                    <td>{index + 1}</td>
                    <td>{user.username?.toUpperCase()}</td>
                    <td>{user.email}</td>
                    <td>{user.phonenumber}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.status
                        ? user.status.toUpperCase().slice(0, 1) +
                          user.status.slice(1)
                        : "N/A"}
                    </td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="user-form-container">
          <h3>{isEdit ? "Update User Details" : "Enter User Details"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter name"
                name="username"
                value={user.username}
                onChange={handleUser}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                name="email"
                value={user.email}
                onChange={handleUser}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="number"
                placeholder="Enter phone number"
                name="phonenumber"
                value={user.phonenumber}
                onChange={handleUser}
                required
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <input
                type="text"
                name="status"
                value={user.status}
                placeholder="e.g. Active, Inactive"
                onChange={handleUser}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={user.role}
                onChange={handleUser}
                required
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder={
                  isEdit ? "Enter new password (optional)" : "Enter password"
                }
                name="password"
                value={user.password}
                onChange={handleUser}
                required={!isEdit}
              />
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="submit-btn"
                disabled={!isEdit && !user.password}
              >
                {isEdit ? "Update User" : "Save User"}
              </button>
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Users;
