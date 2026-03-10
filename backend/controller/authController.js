const db = require("../DB_connection/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../nodeMailer/mailSender");

const register = async (req, res) => {
  try {
    const { username, email, phonenumber, password } = req.body;

    const [existingUser] = await db.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "users already register" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const [users] = await db.query(
      "INSERT INTO users (username,email,password,phonenumber)values(?,?,?,?)",
      [username, email, hashPassword, phonenumber],
    );

    // Send Welcome Email
    const emailHtml = `
      <h1>Welcome to Farmer Market, ${username}!</h1>
      <p>Thank you for registering</p>
      <p>You can now browse and buy fresh organic products directly from local farmers.</p>
      <br/>
     
      <p>The Farmer Market</p>
    `;
    await sendEmail(email, "Welcome to Farmer Market", emailHtml);

    res.status(200).json({
      success: true,
      message: "user register successfully",
      data: users,
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(400).json({ success: false, message: "failed to craete user" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length===0) {
      return res.status(400).json({ success: false, message: "user not found" });
    }

    const isMatch = await bcrypt.compare(password, users[0].password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "invalid password" });
    }

    const token = jwt.sign({ user_id: users[0].id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // console.log("userdata==",users);
    return res
      .status(200)
      .json({
        success: true,
        message: "login succesfully",
        data: { token, userData: users[0] },

        
      } );
     
      
  } catch (error) {

    return res.status(400).json({success:false,message:"failed to login"})

  }
};

module.exports={login,register}
