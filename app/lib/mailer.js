// Sends the "verify your email" message to a customer on signup.
//
// It only activates when BOTH are set in Vercel:
//   - RESEND_API_KEY  (already set, for order alerts)
//   - EMAIL_FROM      (e.g. "Mobile and Accessories <no-reply@yourdomain.com>")
//
// EMAIL_FROM requires a domain verified in Resend, so until you add one this
// stays OFF and signups work normally (no verification required). The day you
// set EMAIL_FROM, verification turns on automatically — no code changes.
export const verificationEnabled = Boolean(
  process.env.RESEND_API_KEY && process.env.EMAIL_FROM
);

export async function sendVerificationEmail(toEmail, name, verifyUrl) {
  if (!verificationEnabled) return false;
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: toEmail,
      subject: "Verify your email — Mobile and Accessories",
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>Thanks for signing up at Mobile and Accessories. Please confirm your
           email address by clicking the button below:</p>
        <p><a href="${verifyUrl}"
              style="display:inline-block;background:#2563eb;color:#fff;
                     padding:10px 20px;border-radius:9999px;text-decoration:none;
                     font-weight:600">Verify my email</a></p>
        <p>Or paste this link into your browser:<br/>${verifyUrl}</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      `,
    });
    return true;
  } catch (err) {
    console.error("Verification email failed:", err);
    return false;
  }
}

export async function sendPasswordResetEmail(toEmail, resetUrl) {
  if (!verificationEnabled) return false;
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: toEmail,
      subject: "Reset your password — Mobile and Accessories",
      html: `
        <h2>Reset your password</h2>
        <p>Click the button below to set a new password. This link expires in
           1 hour.</p>
        <p><a href="${resetUrl}"
              style="display:inline-block;background:#2563eb;color:#fff;
                     padding:10px 20px;border-radius:9999px;text-decoration:none;
                     font-weight:600">Reset password</a></p>
        <p>Or paste this link into your browser:<br/>${resetUrl}</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });
    return true;
  } catch (err) {
    console.error("Password reset email failed:", err);
    return false;
  }
}
