import { mailTrapClient, sender } from "../config/mailtrap";

export const sendVerificationEmail = async (email: string) => {
  const recipient = [{ email }];
  try {
    // Simulate email sending by logging to the console
    const reponse = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "verification email",
      text: "Please click the link to verify your email address.",
    });
    console.log("Verification email sent:", reponse);
  } catch (err) {
    console.error("Failed to send verification email:", err);
    throw new Error("Failed to send verification email");
  }
};
