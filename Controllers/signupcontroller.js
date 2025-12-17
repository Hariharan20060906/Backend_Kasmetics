const User = require("./../Models/signupmodal");
const signupUser = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try{
  const newUser = new User({
    name,
    email,
    phone,
    password,
  });
  const savedUser=await newUser.save();
  res.status(201).json(
    { message: "User created successfully", 
        data: savedUser
    });
} catch (error) {
    res.status(500).json({ message: "Error signing up", 
        error: error.message });
  }
};

module.exports = { signupUser };