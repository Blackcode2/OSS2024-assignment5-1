import React, { useState, useEffect } from "react";
import "./Crud.css";
const url = "https://672887f6270bd0b97555fbea.mockapi.io/proudct";

const Crud = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    category: "Open this select menu",
    product: "",
    price: "",
    quantity: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const validateInputs = () => {
    const { category, product, price, quantity } = formData;

    if (category === "Open this select menu") {
      alert("Please select a valid category.");
      return false;
    }
    if (!product) {
      alert("Product name cannot be empty.");
      return false;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(price) || parseFloat(price) <= 0) {
      alert("Price must be a positive number with up to 2 decimal places.");
      return false;
    }
    if (!/^\d+$/.test(quantity) || parseInt(quantity) <= 0) {
      alert("Quantity must be a positive integer.");
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async () => {
    if (!validateInputs()) return;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        closeModal();
        setFormData({
          category: "Open this select menu",
          product: "",
          price: "",
          quantity: "",
        });
        loadProducts();
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditProduct = (product) => {
    setFormData(product);
    setIsEditing(true);
    setEditingId(product.id);
  };

  const handleUpdateProduct = async () => {
    if (!validateInputs()) return;

    try {
      const response = await fetch(`${url}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        closeModal();
        setIsEditing(false);
        setEditingId(null);
        setFormData({
          category: "Open this select menu",
          product: "",
          price: "",
          quantity: "",
        });
        loadProducts();
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`${url}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("exampleModal");
    const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
    if (bootstrapModal) {
      bootstrapModal.hide();
    }
  };

  return (
    <main>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        {isEditing ? "Update" : "Add"}
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {isEditing ? "Update Product" : "Add New Product"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <div className="formWrapper">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Open this select menu">
                    Open this select menu
                  </option>
                  <option value="Food">Food</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Cloth">Cloth</option>
                  <option value="Book">Book</option>
                </select>
              </div>
              <div className="formWrapper">
                <label htmlFor="product" className="form-label">
                  Product
                </label>
                <input
                  type="text"
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  placeholder="Product"
                  className="form-control"
                />
              </div>
              <div className="formWrapper">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  className="form-control"
                />
              </div>
              <div className="formWrapper">
                <label htmlFor="quantity" className="form-label">
                  Quantity
                </label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Quantity"
                  className="form-control"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={isEditing ? handleUpdateProduct : handleAddProduct}
              >
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>No.</th>
            <th>Category</th>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.category}</td>
              <td>{product.product}</td>
              <td>${product.price}</td>
              <td>{product.quantity}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEditProduct(product)}
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Crud;
