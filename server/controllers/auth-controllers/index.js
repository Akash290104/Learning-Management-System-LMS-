const User = require("../../modals/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { userName, userEmail, userPassword, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ userEmail: userEmail }, { userName: userName }],
  });

  if (existingUser) {
    console.log("User already exists");
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(userPassword, 10);

  const newUser = new User({
    userName,
    userEmail,
    userPassword: hashedPassword,
    role,
  });
  await newUser.save();

  console.log("User registered successfully");
  return res
    .status(200)
    .json({ success: true, message: "User registered successfully", newUser });
};

const loginUser = async (req, res) => {
  const { userEmail, userPassword } = req.body;
  const user = await User.findOne({ userEmail });

  if (!user) {
    console.log("Invalid userEmail");
    return res
      .status(400)
      .json({ success: false, message: "Invalid user email" });
  }

  const password = user.userPassword;
  console.log(password, userPassword);

  const isCorrectPassword = await bcrypt.compare(userPassword, password);
  console.log(isCorrectPassword);

  if (!isCorrectPassword) {
    console.log("Incorrect password");
    return res
      .status(400)
      .json({ success: false, message: "Invalid password" });
  }

  const accessToken = jwt.sign(
    {
      _id: user._id,
      userName: user.userName,
      userEmail: user.userEmail,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );

  console.log("User logged in successfully");
  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    user,
    accessToken,
  });
};

module.exports = { registerUser, loginUser };
