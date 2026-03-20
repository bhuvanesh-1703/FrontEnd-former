import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import API_URL from "../config";
import "../Admin-Css-Folder/Category.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    subcategory: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`);
      if (res.data && res.data.categories) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setImageFile(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subcategory: "",
      description: "",
    });
    setImageFile(null);
    setIsAddMode(false);
    setIsEditMode(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("category_name", formData.name);
    data.append("subcategory_name", formData.subcategory);
    data.append("description", formData.description);
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/api/categories/${editId}`, data);
        Swal.fire("Success", "Category updated successfully", "success");
      } else {
        await axios.post(`${API_URL}/api/categories`, data);
        Swal.fire("Success", "Category added successfully", "success");
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error("Error saving category", err);
      Swal.fire("Error", "Failed to save category", "error");
    }
  };

  const handleEdit = (cat) => {
    setFormData({
      name: cat.category_name,
      subcategory: cat.subcategory_name,
      description: cat.description || "",
    });
    setEditId(cat.id);
    setIsEditMode(true);
    setIsAddMode(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2e7d32",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/api/categories/${id}`);
        Swal.fire("Deleted!", "Category has been deleted.", "success");
        fetchCategories();
      } catch (err) {
        console.error("Error deleting category", err);
        Swal.fire("Error", "Failed to delete category", "error");
      }
    }
  };

  return (
    <div className="category-container">
      <div className="category-header">
        <h2>{isEditMode ? "Edit Category" : "Manage Categories"}</h2>
        <button
          className="add-btn"
          onClick={() => (isAddMode ? resetForm() : setIsAddMode(true))}
        >
          {isAddMode ? "View All Categories" : "Add New Category"}
        </button>
      </div>

      {isAddMode ? (
        <div className="category-form-container">
          <h3>
            {isEditMode ? "Update Category Details" : "Enter Category Details"}
          </h3>
          <form className="category-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Category Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Category Name"
                required
              />
            </div>
            <div className="form-group">
              <label>Subcategory Name</label>
              <input
                type="text"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                placeholder="Subcategory Name"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
              />
            </div>
            <div className="form-group">
              <label>Category Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required={!isEditMode}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {isEditMode ? "Update Category" : "Save Category"}
              </button>
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="category-table-container">
          {categories.length > 0 ? (
            <table className="category-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Category Name</th>
                  <th>Subcategory</th>
                  <th>Description</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={cat.id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="table-img-wrapper">
                        <img
                          src={`${API_URL}/uploads/${cat.image}`}
                          alt={cat.category_name || "Category"}
                          className="table-category-img"
                        />
                      </div>
                    </td>
                    <td className="font-semibold">{cat.category_name}</td>
                    <td>
                      <span className="subcategory-badge">
                        {cat.subcategory_name}
                      </span>
                    </td>
                    <td className="description-cell">
                      {cat.description || "No description"}
                    </td>
                    <td className="actions-cell">
                      <div className="table-actions">
                        <button
                          className="table-edit-btn"
                          onClick={() => handleEdit(cat)}
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          className="table-delete-btn"
                          onClick={() => handleDelete(cat.id)}
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">No categories found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Category;
