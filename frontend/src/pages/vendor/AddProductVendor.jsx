import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud, FiPackage, FiActivity } from "react-icons/fi";

const AddProductVendor = () => {
  const [categories, setCategories] = useState([]);
  const [values, setValues] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const vendorData = JSON.parse(localStorage.getItem("vendor"));

  useEffect(() => {
    if (!vendorData) {
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Please login again to add products.",
        confirmButtonColor: "#2D5A27",
      }).then(() => {
        navigate("/vendor-login");
      });
      return;
    }

    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5100/api/categories");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

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

    setLoading(true);
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
        "http://localhost:5100/api/product",
        formData,
      );
      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Submitted!",
          text: "Product sent for admin approval.",
          confirmButtonColor: "#2D5A27",
        });
        navigate("/vendor-products");
      }
    } catch (err) {
      Swal.fire("Error", "Submission failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

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
        }}
      >
        <h3 className="section-title">Add New Product</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-4">
            <label
              style={{
                fontWeight: "600",
                color: "#2D5A27",
                marginBottom: "8px",
              }}
            >
              Product Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. Fresh Organic Apples"
              required
              onChange={handleInput}
            />
          </div>
          <div className="col-md-6 mb-4">
            <label
              style={{
                fontWeight: "600",
                color: "#2D5A27",
                marginBottom: "8px",
              }}
            >
              Category
            </label>
            <select
              name="category"
              className="form-control"
              required
              onChange={handleInput}
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
                color: "#2D5A27",
                marginBottom: "8px",
              }}
            >
              Price (per kg)
            </label>
            <div className="input-group">
              <span className="input-group-text">₹</span>
              <input
                type="number"
                name="price"
                className="form-control"
                placeholder="0.00"
                required
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <label
              style={{
                fontWeight: "600",
                color: "#2D5A27",
                marginBottom: "8px",
              }}
            >
              Available Stock (kg)
            </label>
            <input
              type="number"
              name="stock"
              className="form-control"
              placeholder="0"
              required
              onChange={handleInput}
            />
          </div>
          <div className="col-12 mb-4">
            <label
              style={{
                fontWeight: "600",
                color: "#2D5A27",
                marginBottom: "8px",
              }}
            >
              Product Description
            </label>
            <textarea
              name="description"
              className="form-control"
              rows="4"
              placeholder="Describe your organic product..."
              required
              onChange={handleInput}
            ></textarea>
          </div>
          <div className="col-12 mb-4">
            <label
              style={{
                fontWeight: "600",
                color: "#2D5A27",
                marginBottom: "8px",
              }}
            >
              Product Images
            </label>
            <div
              style={{
                border: "2px dashed #E0E6E0",
                borderRadius: "12px",
                padding: "30px",
                textAlign: "center",
                background: "#fafafa",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <FiUploadCloud
                size={40}
                color="#2D5A27"
                style={{ marginBottom: "15px" }}
              />
              <p style={{ margin: 0, color: "#7F8C8D" }}>
                Select product images (PNG, JPG, WEBP)
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
              <small className="text-success mt-2 d-block">
                {files.length} images selected
              </small>
            )}
          </div>
        </div>

        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button
            type="submit"
            disabled={loading}
            className="login-action-btn"
            style={{ padding: "12px 40px", fontSize: "1rem" }}
          >
            {loading ? "Submitting..." : "Submit for Approval"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductVendor;
