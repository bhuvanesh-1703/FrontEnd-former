import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import API_URL from "../config";
import "../Admin-Css-Folder/Product.css";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/product`);
      if (res.data.product) {
        // Sort pending products to the top
        const sortedProducts = res.data.product.sort((a, b) => {
          if (a.status === "pending" && b.status !== "pending") return -1;
          if (b.status === "pending" && a.status !== "pending") return 1;
          return 0; // Keep existing order for the rest
        });
        setProducts(sortedProducts);
      }
      // console.log(res.data);
    } catch (err) {
      console.error(
        "Failed to fetch products:",
        err.response?.data || err.message,
      );
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`);
      if (res.data && res.data.categories) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error(
        "Failed to fetch categories:",
        err.response?.data || err.message,
      );
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files: targetFiles } = e.target;
    if (name === "image") {
      setImageFile(Array.from(targetFiles));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("added_by", "admin");

    if (imageFile && Array.isArray(imageFile)) {
      imageFile.forEach((file) => {
        data.append("image", file);
      });
    }

    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/api/product/${editId}`, data);
        Swal.fire("Updated!", "Product Updated Successfully", "success");
      } else {
        await axios.post(`${API_URL}/api/product`, data);
        Swal.fire("Added!", "Product Added Successfully", "success");
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error(
        "Submission failed:",
        error.response?.data || error.message,
      );
      Swal.fire("Error", "Failed to save product", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      stock: "",
      category: "",
      description: "",
    });
    setImageFile(null);
    setIsAddMode(false);
    setIsEditMode(false);
    setEditId(null);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.categories_id,
      description: product.description,
    });
    setEditId(product.id);
    setIsEditMode(true);
    setIsAddMode(true);
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`${API_URL}/api/product/${id}`);
        Swal.fire("Deleted!", "Product has been deleted.", "success");
        fetchProducts();
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
      Swal.fire("Error!", "Failed to delete product.", "error");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const result = await Swal.fire({
        title: `Are you sure you want to ${newStatus === "approved" ? "Approve" : "Reject"} this product?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: newStatus === "approved" ? "#10b981" : "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: `Yes, ${newStatus === "approved" ? "Approve" : "Reject"}!`,
      });

      if (result.isConfirmed) {
        await axios.put(`${API_URL}/api/admin/product-status/${id}`, {
          status: newStatus,
        });
        Swal.fire("Success!", `Product has been ${newStatus}.`, "success");
        fetchProducts();
      }
    } catch (err) {
      console.error("Failed to update product status:", err);
      Swal.fire("Error!", "Failed to update product status.", "error");
    }
  };

  return (
    <div className="product-manager-container">
      <div className="product-manager-header">
        <h2>{isEditMode ? "Edit Product" : "Manage Products"}</h2>
        <button
          className="add-btn"
          onClick={() => (isAddMode ? resetForm() : setIsAddMode(true))}
        >
          {isAddMode ? "View All Products" : "Add New Product"}
        </button>
      </div>

      {isAddMode ? (
        <div className="product-form-container">
          <h3>
            {isEditMode ? "Update Product Details" : "Enter Product Details"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
              />
            </div>
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description"
              />
            </div>
            <div className="form-group">
              <label>Product Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required={!isEditMode}
                multiple
              />
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="submit-btn"
                disabled={!isEditMode && !imageFile}
              >
                {isEditMode ? "Update Product" : "Save Product"}
              </button>
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>
                    {product.image ? (
                      <img
                        src={`${API_URL}/uploads/${product.image.split(",")[0]}`}
                        alt={product.name}
                        className="product-img-thumb"
                      />
                    ) : (
                      <div className="product-img-placeholder">No Image</div>
                    )}
                  </td>
                  <td>
                    {product.name}
                    {product.added_by === "vendor" && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          background: "#e0e7ff",
                          color: "#4338ca",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          marginLeft: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        VENDOR
                      </span>
                    )}
                  </td>
                  <td>{product.category_name}</td>
                  <td>Rs.{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        backgroundColor:
                          product.status === "approved"
                            ? "#dcfce7"
                            : product.status === "pending"
                              ? "#fef08a"
                              : "#fee2e2",
                        color:
                          product.status === "approved"
                            ? "#166534"
                            : product.status === "pending"
                              ? "#854d0e"
                              : "#991b1b",
                      }}
                    >
                      {product.status || "approved"}
                    </span>
                  </td>
                  <td>
                    <div
                      className="action-btns"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "5px",
                        justifyContent: "center",
                      }}
                    >
                      {product.status === "pending" ? (
                        <>
                          <button
                            className="edit-btn"
                            style={{
                              background: "#10b981",
                               color:"white",
                              padding: "5px 10px",
                            }}
                            onClick={() =>
                              handleStatusUpdate(product.id, "approved")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="delete-btn"
                            style={{
                              background: "#ef4444",
                              color:"white",
                              padding: "5px 10px",
                            }}
                            onClick={() =>
                              handleStatusUpdate(product.id, "rejected")
                            }
                          >
                            Reject
                          </button>
                        </>
                      ) : null}

                      <button
                        className="edit-btn"
                        style={{ padding: "5px 10px" }}
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        style={{ padding: "5px 10px" }}
                        onClick={() => handleDelete(product.id)}
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
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Product;
