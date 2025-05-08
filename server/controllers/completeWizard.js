import User from "../models/User.js";

export async function completeWizard(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save the form data to wizardData field
    user.wizardData = req.body;
    user.hasCompletedWizard = true;
    await user.save();

    res.json({
      message: "Wizard completed successfully",
      wizardData: user.wizardData,
    });
  } catch (error) {
    console.error("Error completing wizard:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getWizardData(req, res) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "Wizard data retrieved successfully",
      wizardData: user.wizardData,
    });
  } catch (error) {
    console.error("Error retrieving wizard data:", error);
    res.status(500).json({ message: "Server error" });
  }
}
