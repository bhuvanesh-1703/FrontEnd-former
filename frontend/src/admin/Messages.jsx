import React, { useState, useEffect } from "react";
import "../Admin-Css-Folder/Messages.css";
import { FaReply, FaTrash, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:5100/api/messages");
      if (response.data && response.data.messages) {
        setMessages(response.data.messages);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete message?",
      text: "want to delete message",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2e7d32",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5100/api/messages/${id}`);
          setMessages(messages.filter((msg) => msg.id !== id));
          if (selectedMessage?.id === id) setSelectedMessage(null);
          Swal.fire("Deleted!", "Message has been deleted.", "success");
        } catch (err) {
          Swal.fire("Error!", "Failed to delete message.", "error");
        }
      }
    });
  };

  const viewMessage = (msg) => {
    Swal.fire({
      title: `<span style="color: #2e7d32">Messages</span>`,
      html: `
     <div style="text-align: left; margin-top: 15px;">
     <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; line-height: 1.6; color: #333;">
     ${msg.message}
     </div>
  </div>
  `,
      confirmButtonText: "Close",
      confirmButtonColor: "#2e7d32",
    });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="product-manager-container">
      <div className="product-manager-header">
        <h2>Customer Messages</h2>
        <div className="orders-stats">
          <div className="stat-card">
            <span>Total Messages</span>
            <strong>{messages.length}</strong>
          </div>
        </div>
      </div>

      <div className="orders-list-card">
        <div className="table-responsive">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sender</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Messages</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    Loading messages...
                  </td>
                </tr>
              ) : messages.length > 0 ? (
                messages.map((msg, index) => (
                  <tr key={msg.id}>
                    <td>{index + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{msg.name}</div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {msg.email}
                      </div>
                    </td>
                    <td>{msg.phone}</td>
                    <td>{new Date(msg.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="edit-btn"
                          onClick={() => viewMessage(msg)}
                        >
                          View
                        </button>
                      </div>
                    </td>
                    <td>
                      {" "}
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(msg.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No messages found.
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

export default Messages;
