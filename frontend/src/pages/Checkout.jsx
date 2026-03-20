import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import {
  HiLocationMarker,
  HiCreditCard,
  HiShoppingBag,
  HiCheckCircle,
  HiArrowRight,
  HiUser,
  HiMail,
  HiPhone,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import "../css/Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState({
    fullName: userData?.username || "",
    email: userData?.email || "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const fetchCart = async () => {
    try {
      const userId = userData?.id || userData?._id;
      if (!userId) {
        navigate("/login");
        return;
      }
      const response = await axios.get(
        `${API_URL}/api/cart?userId=${userId}`,
      );
      setCart(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "address",
      "city",
      "pincode",
    ];
    const isFormValid = requiredFields.every(
      (field) => formData[field].trim() !== "",
    );

    if (!isFormValid) {
      Swal.fire(
        "Incomplete Info",
        "Please fill in all shipping details.",
        "warning",
      );
      return;
    }

    setProcessing(true);

    try {
      const userId = userData?.id || userData?._id;
      const orderData = {
        user_id: userId,
        payment_method: paymentMethod,
        shipping_address: formData,
        products: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };

      const response = await axios.post(
        `${API_URL}/api/orders`,
        orderData,
      );

      if (response.data.success) {
        // Success Message
        await Swal.fire({
          icon: "success",
          title: "Order Placed Successfully!",

          confirmButtonColor: "#2e7d32",
          confirmButtonText: "Return to Home",
        });
        setCart([]);
        navigate("/");
      } else {
        throw new Error(response.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Order Placement Error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to place order. Please try again.";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-wrapper d-flex align-items-center justify-content-center">
        <Spinner animation="grow" variant="success" />
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <Container>
        <div className="checkout-header animate-fade">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">
            Secure your farm-fresh delivery in minutes
          </p>
        </div>

        {/* Progress Tracker */}
        {/* <div className="checkout-progress animate-fade">
          <div className="progress-step active">
            <span className="step-num">1</span>
            <span>Shipping</span>
          </div>
          <div className="step-divider"></div>
          <div className="progress-step">
            <span className="step-num">2</span>
            <span>Payment</span>
          </div>
          <div className="step-divider"></div>
          <div className="progress-step">
            <span className="step-num">3</span>
            <span>Success</span>
          </div>
        </div> */}

        <Row className="g-5">
          <Col lg={7}>
            <div className="checkout-card animate-fade">
              <h2 className="section-title">
                <HiLocationMarker /> Shipping Details
              </h2>

              <Form className="checkout-form" onSubmit={handlePlaceOrder}>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="text"
                          name="fullName"
                          placeholder="Your full name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength="10"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Street Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="address"
                        placeholder="House no, Building name, Street..."
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        placeholder="Your city"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Pincode</Form.Label>
                      <Form.Control
                        type="text"
                        name="pincode"
                        placeholder="6-digit pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h2 className="section-title mt-5">
                  <HiCreditCard /> Payment Method
                </h2>

                <div className="payment-methods">
                  <div
                    className={`payment-option ${paymentMethod === "cod" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <div className="payment-radio"></div>
                    <div className="payment-info">
                      <p className="payment-label">Cash on Delivery</p>
                      <p className="payment-desc">
                        Pay when your farm produce arrives
                      </p>
                    </div>
                  </div>

                  <div
                    className={`payment-option ${paymentMethod === "online" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("online")}
                  >
                    <div className="payment-radio"></div>
                    <div className="payment-info">
                      <p className="payment-label">Online Payment</p>
                      <p className="payment-desc">
                        Pay securely via Cards, UPI or Netbanking
                      </p>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </Col>

          <Col lg={5}>
            <div className="checkout-card summary-column animate-fade delay-1">
              <h2 className="section-title">
                <HiShoppingBag /> Order Summary
              </h2>

              <div className="summary-items">
                {cart.map((item) => (
                  <div key={item.id} className="summary-item-small">
                    <img
                      src={`${API_URL}/uploads/${item.image.split(",")[0]}`}
                      alt={item.name}
                      className="summary-img"
                    />
                    <div className="summary-details">
                      <p className="summary-name">{item.name}</p>
                      <p className="summary-qty-price">
                        {item.quantity}kg * ₹{item.price}
                      </p>
                    </div>
                    <div className="summary-item-total">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping Fee</span>
                  <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
                <div className="summary-row grand-total">
                  <span>Total Amount</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                className="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Spinner size="sm" animation="border" /> Processing...
                  </>
                ) : (
                  <>
                    Place Order ₹{total} <HiArrowRight />
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <p className="text-muted small">
                  <HiCheckCircle className="text-success" /> Quality Guaranteed
                  • Fresh from the Farm
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Checkout;
