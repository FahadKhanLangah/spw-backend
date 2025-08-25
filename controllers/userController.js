// controllers/userController.js
import User from "../models/userModel.js";

// Get all addresses for the authenticated user
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, fullAddress, city, postalCode, country, isDefault } = req.body;

    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing"
      });
    }

    if (!title || !fullAddress || !city || !country) {
      return res.status(400).json({
        success: false,
        message: "Title, Full Address, City, and Country are required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // If new address isDefault = true, unset other defaults
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      title,
      fullAddress,
      city,
      postalCode,
      country,
      isDefault: isDefault || false
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const { title, fullAddress, city, postalCode, country, isDefault } = req.body;

    // Check if req.body exists
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    if (title !== undefined) address.title = title;
    if (fullAddress !== undefined) address.fullAddress = fullAddress;
    if (city !== undefined) address.city = city;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (country !== undefined) address.country = country;

    // If updated address isDefault = true, unset other defaults
    if (isDefault) {
      user.addresses.forEach(addr => {
        if (!addr._id.equals(address._id)) {
          addr.isDefault = false;
        }
      });
      address.isDefault = true;
    } else if (isDefault === false) {
      address.isDefault = false;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    // Check if we're deleting the default address
    const wasDefault = address.isDefault;

    // Remove the address
    user.addresses.pull(addressId);

    // If we deleted the default address and there are other addresses,
    // set the first one as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; 
    const allowedFields = ["firstName", "lastName", "phoneNumber", "preference"];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

