const User = require('../models/userModel');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, dateOfBirth, gender, address, bloodGroup, allergies, emergencyContact, emergencyContactName } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { name, phone, dateOfBirth, gender, address, bloodGroup, allergies, emergencyContact, emergencyContactName },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// module.exports = {
//   getProfile,
//   updateProfile
// };