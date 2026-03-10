const db = require("../DB_connection/db");
const sendEmail = require("../nodeMailer/mailSender");

const getMessages = async (req, res) => {
  try {
    const [messages] = await db.query("SELECT * FROM messages ORDER BY created_at DESC");
    res.status(200).json({ success: true, message: "Messages fetched successfully", messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch messages", error: error.message });
  }
};

const postMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
   
    await db.query(
      "INSERT INTO messages (name, email, phone, message) VALUES (?, ?, ?, ?)",
      [name, email, phone, message]
    );

  
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #2e7d32;">Hello ${name},</h2>
        <p>Thank you for reaching out to us. We have received your message. Our team will review it and get back to you at <strong>${phone}</strong> or via email as soon as possible.</p>
        <br/>
        <p>Best Regards,</p>
        <p><strong>Farmer Market Team</strong></p>
      </div>
    `;

    await sendEmail(email, "Message Received - Farmer Market", userEmailHtml);

    res.status(201).json({ success: true, message: "Message sent successfully and confirmation email sent" });
  } catch (error) {
    console.error("Post Message Error:", error);
    res.status(500).json({ success: false, message: "Failed to send message", error: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM messages WHERE id = ?", [id]);
    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete message", error: error.message });
  }
};

module.exports = { getMessages, postMessage, deleteMessage };
