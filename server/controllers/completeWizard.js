import User from '../models/User.js';

export async function completeWizard(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.hasCompletedWizard = true;
    await user.save();

    res.json({ message: "Wizard completed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
