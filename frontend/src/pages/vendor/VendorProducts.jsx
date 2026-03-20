import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import API_URL from "../../config";
import {
  FiPlus,
  FiTrash2,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUploadCloud,
  FiArrowLeft,
} from "react-icons/fi";

const VendorProducts = () => {
  // Shared state
  const vendorData = JSON.parse(localStorage.getItem("vendor"));

  // View state
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Products list state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Add product state
  const [categories, setCategories] = useState([]);
  const [values, setValues] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
  });
  const [files, setFiles] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await axios.get(
        `${API_URL}/api/product?vendorId=${vendorData.id}`,
      );
      setProducts(res.data.product || []);
    } catch (err) {
      console.error("Error fetching vendor products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    if (vendorData) {
      fetchProducts();
      fetchCategories();
    }
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/api/product/${id}`);
        Swal.fire("Deleted!", "Your product has been deleted.", "success");
        fetchProducts();
      } catch (err) {
        Swal.fire("Error", "Failed to delete product.", "error");
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#e8f5e9",
              color: "#2e7d32",
              padding: "4px 10px",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: "700",
              textTransform: "uppercase",
            }}
          >
            <FiCheckCircle style={{ marginRight: "4px" }} /> Approved
          </span>
        );
      case "pending":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#fff3e0",
              color: "#e65100",
              padding: "4px 10px",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: "700",
              textTransform: "uppercase",
            }}
          >
            <FiClock style={{ marginRight: "4px" }} /> Pending
          </span>
        );
      case "rejected":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#ffebee",
              color: "#c62828",
              padding: "4px 10px",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: "700",
              textTransform: "uppercase",
            }}
          >
            <FiXCircle style={{ marginRight: "4px" }} /> Rejected
          </span>
        );
      default:
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#f5f5f5",
              color: "#616161",
              padding: "4px 10px",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: "700",
              textTransform: "uppercase",
            }}
          >
            {status}
          </span>
        );
    }
  };

  const handleInput = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.category)
      return Swal.fire("Error", "Please select a category", "error");

    setLoadingSubmit(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("stock", values.stock);
    formData.append("category", values.category);
    formData.append("description", values.description);
    formData.append("vendor_id", vendorData.id);
    formData.append("added_by", "vendor");

    for (let i = 0; i < files.length; i++) {
      formData.append("image", files[i]);
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/product`,
        formData,
      );
      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Submitted!",
          text: "Product sent for admin approval.",
          confirmButtonColor: "#2D5A27",
        });

        // Reset form and go back to list
        setValues({
          name: "",
          price: "",
          stock: "",
          category: "",
          description: "",
        });
        setFiles([]);
        setIsAddingProduct(false);
        fetchProducts(); // refresh product list
      }
    } catch (err) {
      Swal.fire("Error", "Submission failed. Please try again.", "error");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // ----------------------------------------------------------------------
  // RENDER ADD PRODUCT FORM
  // ----------------------------------------------------------------------
  if (isAddingProduct) {
    return (
      <div
        className="order-card"
        style={{
          padding: "40px",
          background: "white",
          borderRadius: "16px",
          boxShadow: "var(--vendor-shadow)",
        }}
      >
        <div
          className="section-header"
          style={{
            marginBottom: "30px",
            borderBottom: "1px solid var(--vendor-border)",
            paddingBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <button
            type="button"
            onClick={() => setIsAddingProduct(false)}
            style={{
              background: "none",
              border: "none",
              color: "#6b7280",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
              borderRadius: "50%",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <FiArrowLeft size={20} />
          </button>
          <h3
            className="section-title"
            style={{ margin: 0, fontSize: "1.5rem", fontWeight: "700" }}
          >
            Add New Product
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Form fields identical to previous AddProductVendor */}
          <div className="row">
            <div className="col-md-6 mb-4">
              <label
                style={{
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={values.name}
                className="form-control"
                placeholder="e.g. Fresh Organic Apples"
                required
                onChange={handleInput}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                }}
              />
            </div>
            <div className="col-md-6 mb-4">
              <label
                style={{
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Category
              </label>
              <select
                name="category"
                value={values.category}
                className="form-control"
                required
                onChange={handleInput}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                }}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-4">
              <label
                style={{
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Price (per kg)
              </label>
              <div className="input-group">
                <span
                  className="input-group-text"
                  style={{ background: "#f3f4f6", border: "1px solid #d1d5db" }}
                >
                  ₹
                </span>
                <input
                  type="number"
                  name="price"
                  value={values.price}
                  className="form-control"
                  placeholder="0.00"
                  required
                  onChange={handleInput}
                  style={{ padding: "12px", border: "1px solid #d1d5db" }}
                />
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <label
                style={{
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Available Stock (kg)
              </label>
              <input
                type="number"
                name="stock"
                value={values.stock}
                className="form-control"
                placeholder="0"
                required
                onChange={handleInput}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                }}
              />
            </div>
            <div className="col-12 mb-4">
              <label
                style={{
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Product Description
              </label>
              <textarea
                name="description"
                value={values.description}
                className="form-control"
                rows="4"
                placeholder="Describe your organic product..."
                required
                onChange={handleInput}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                }}
              ></textarea>
            </div>
            <div className="col-12 mb-4">
              <label
                style={{
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Product Images
              </label>
              <div
                style={{
                  border: "2px dashed #d1d5db",
                  borderRadius: "12px",
                  padding: "40px",
                  textAlign: "center",
                  background: "#f9fafb",
                  cursor: "pointer",
                  position: "relative",
                  transition: "border-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.borderColor = "#10b981")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.borderColor = "#d1d5db")
                }
              >
                <FiUploadCloud
                  size={40}
                  color="#10b981"
                  style={{ marginBottom: "15px" }}
                />
                <p style={{ margin: 0, color: "#6b7280", fontWeight: "500" }}>
                  Click to select product images (PNG, JPG, WEBP)
                </p>
                <input
                  type="file"
                  multiple
                  className="form-control"
                  style={{
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                    cursor: "pointer",
                  }}
                  onChange={handleFile}
                />
              </div>
              {files.length > 0 && (
                <small
                  style={{
                    color: "#10b981",
                    fontWeight: "600",
                    marginTop: "8px",
                    display: "block",
                  }}
                >
                  {files.length} images selected
                </small>
              )}
            </div>
          </div>

          <div style={{ textAlign: "right", marginTop: "30px" }}>
            <button
              type="submit"
              disabled={loadingSubmit}
              className="login-action-btn"
              style={{
                padding: "12px 40px",
                fontSize: "1rem",
                fontWeight: "600",
                background: "#10b981",
                border: "none",
                color: "white",
                borderRadius: "8px",
                cursor: loadingSubmit ? "not-allowed" : "pointer",
                opacity: loadingSubmit ? 0.7 : 1,
              }}
            >
              {loadingSubmit ? "Submitting..." : "Submit for Approval"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // RENDER PRODUCTS LIST
  // ----------------------------------------------------------------------
  return (
    <div
      className="order-card"
      style={{
        padding: "0",
        background: "white",
        borderRadius: "16px",
        boxShadow: "var(--vendor-shadow)",
      }}
    >
      <div
        className="section-header"
        style={{
          padding: "20px 25px",
          borderBottom: "1px solid var(--vendor-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3
          className="section-title"
          style={{ margin: 0, fontSize: "1.5rem", fontWeight: "700" }}
        >
          My Products
        </h3>
        <button
          onClick={() => setIsAddingProduct(true)}
          className="view-all-btn"
          style={{
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "none",
            borderRadius: "8px",
            background: "#10b981",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#059669")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#10b981")}
        >
          <FiPlus /> Add New Product
        </button>
      </div>

      <div className="table-responsive">
        <table className="table" style={{ margin: 0 }}>
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              <th
                style={{
                  padding: "15px 25px",
                  color: "#6b7280",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  fontWeight: "700",
                }}
              >
                Product
              </th>
              <th
                style={{
                  color: "#6b7280",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  fontWeight: "700",
                }}
              >
                Price
              </th>
              <th
                style={{
                  color: "#6b7280",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  fontWeight: "700",
                }}
              >
                Stock
              </th>
              <th
                style={{
                  color: "#6b7280",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  fontWeight: "700",
                }}
              >
                Status
              </th>
              <th
                style={{
                  color: "#6b7280",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  fontWeight: "700",
                  textAlign: "right",
                  paddingRight: "40px",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loadingProducts ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center"
                  style={{ padding: "80px" }}
                >
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  style={{ borderBottom: "1px solid #f3f4f6" }}
                >
                  <td style={{ padding: "15px 25px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                      }}
                    >
                      {product.image ? (
                        <img
                          src={`${API_URL}/uploads/${product.image.split(",")[0]}`}
                          alt=""
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            border: "1px solid #e5e7eb",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            background: "#f3f4f6",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            color: "#9ca3af",
                          }}
                        >
                          No Img
                        </div>
                      )}
                      <span
                        style={{
                          fontWeight: "700",
                          color: "#111827",
                          fontSize: "0.95rem",
                        }}
                      >
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      verticalAlign: "middle",
                      fontWeight: "700",
                      color: "#374151",
                    }}
                  >
                    ₹{product.price}
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#9ca3af",
                        fontWeight: "500",
                      }}
                    >
                      /kg
                    </span>
                  </td>
                  <td
                    style={{
                      verticalAlign: "middle",
                      color: "#4b5563",
                      fontWeight: "500",
                    }}
                  >
                    {product.stock} kg
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    {getStatusBadge(product.status)}
                  </td>
                  <td
                    style={{
                      verticalAlign: "middle",
                      textAlign: "right",
                      paddingRight: "40px",
                    }}
                  >
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={{
                        background: "#fee2e2",
                        border: "1px solid #fecaca",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontSize: "1.1rem",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#fca5a5";
                        e.currentTarget.style.borderColor = "#f87171";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "#fee2e2";
                        e.currentTarget.style.borderColor = "#fecaca";
                        e.currentTarget.style.color = "#ef4444";
                      }}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center"
                  style={{ padding: "80px 40px" }}
                >
                  <div style={{ color: "#9ca3af", marginBottom: "20px" }}>
                    <FiPlus size={64} style={{ opacity: 0.2 }} />
                  </div>
                  <h4
                    style={{
                      color: "#111827",
                      margin: "0 0 10px 0",
                      fontSize: "1.2rem",
                      fontWeight: "700",
                    }}
                  >
                    No products added yet
                  </h4>
                  <p style={{ color: "#6b7280", margin: "0 0 20px 0" }}>
                    Start adding your organic products to reach more customers!
                  </p>
                  <button
                    onClick={() => setIsAddingProduct(true)}
                    style={{
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#10b981",
                      color: "white",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Add Your First Product
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorProducts;
