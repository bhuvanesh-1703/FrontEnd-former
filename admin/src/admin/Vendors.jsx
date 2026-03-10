import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      const res = await axios.get("http://localhost:5100/api/vendor");
      if (res.data.success) {
        setVendors(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    const result = await Swal.fire({
      title: `Are you sure you want to ${status} this vendor?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.put(
          `http://localhost:5100/api/vendor/status/${id}`,
          { status },
        );
        if (res.data.success) {
          Swal.fire("Updated!", res.data.message, "success");
          fetchVendors();
        }
      } catch (err) {
        Swal.fire("Error", "Failed to update status", "error");
      }
    }
  };

  const viewIdProof = (image) => {
    Swal.fire({
      title: "ID Proof",
      imageUrl: `http://localhost:5100/uploads/${image}`,
      imageAlt: "ID Proof",
      confirmButtonText: "Close",
    });
  };

  if (loading) return <div className="p-4">Loading vendors...</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4">Manage Vendors</h2>
      <div className="table-responsive bg-white p-3 rounded shadow-sm">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Shop Name</th>
              <th>Vendor Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>ID Proof</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.shop_name}</td>
                <td>{vendor.username}</td>
                <td>{vendor.email}</td>
                <td>{vendor.phonenumber}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => viewIdProof(vendor.id_proof)}
                  >
                    <FaEye /> View
                  </button>
                </td>
                <td>
                  <span
                    className={`badge ${
                      vendor.status === "approved"
                        ? "bg-success"
                        : vendor.status === "rejected"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                    }`}
                  >
                    {vendor.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  {vendor.status === "pending" && (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() =>
                          handleStatusUpdate(vendor.id, "approved")
                        }
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          handleStatusUpdate(vendor.id, "rejected")
                        }
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                  {vendor.status !== "pending" && (
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleStatusUpdate(vendor.id, "pending")}
                      title="Reset to Pending"
                    >
                    changes
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {vendors.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No vendors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vendors;
