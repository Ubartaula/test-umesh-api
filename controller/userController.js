const User = require("../model/User");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  const users = await User.find().select("-password").lean().exec();
  if (!users?.length)
    return res.status(401).json({ message: "NO users data found" });
  res.json(users);
};

const addUser = async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role)
    return res.status(400).json({ message: "All fields required" });
  const checkDuplicate = await User.findOne({ username })
    .collation({
      locale: "en",
      strength: 2,
    })
    .exec();

  if (checkDuplicate)
    return res.status(409).json({ message: "Conflict , duplicate user found" });
  const hashPassword = await bcrypt.hash(password, 10);

  const newUserObj = {
    username: username,
    password: hashPassword,
    role: role,
  };

  // await User.create(newUserObj);
  // res.json({ message: `a new user ${username} created` });

  if (newUserObj) {
    await User.create(newUserObj);
    res.json({ message: `a new user ${username} has been created` });
  } else {
    return res
      .status(400)
      .json({ message: "new user object could not create" });
  }
};

const editUser = async (req, res) => {
  const { id, username, password, role, isActive } = req.body;
  if (!id) return res.status(400).json({ message: "id required to edit user" });
  const findUserToEdit = await User.findById(id).exec();
  if (!findUserToEdit)
    return res.status(400).json({ message: "no such user found" });

  const checkDuplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .exec();
  if (checkDuplicate && checkDuplicate._id.toString() !== id)
    return res.json({ message: "Conflict , duplicate user" });

  findUserToEdit.username = username;
  if (password) {
    const hashPassword = await bcrypt.hash(password, 10);
    findUserToEdit.password = hashPassword;
  }
  if (role) {
    findUserToEdit.role = role;
  }
  if (isActive) {
    findUserToEdit.isActive = isActive;
  }

  await findUserToEdit.save();

  res.json({ message: `a user ${username} has been edited` });
};

const deleteUser = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.json({ message: "id required to delete" });
  const findToDelete = await User.findById(id).exec();
  if (!findToDelete)
    return res.json({ message: "No Such User found to Delete" });
  await User.deleteOne(findToDelete);
  res.json({ message: "A user has been deleted" });
};

module.exports = { getUsers, addUser, editUser, deleteUser };
