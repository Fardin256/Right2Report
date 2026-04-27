const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendEmail({ to, subject, issueType, area, description, imageUrl, latitude, longitude, userName }) {
  const mailOptions = {
    from: `"RTR - Report The Road" <${process.env.EMAIL_USER}>`,
    to,
    subject: subject || `New Complaint: ${issueType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
        <div style="background: #667eea; padding: 20px; text-align: center;">
          <h2 style="color: white; margin: 0;">⚠️ New Public Issue Reported</h2>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px;">A new complaint has been submitted in your jurisdiction. Please take necessary action.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="background: #f9f9f9;">
              <td style="padding: 12px; font-weight: bold; border: 1px solid #eee;">Reported By</td>
              <td style="padding: 12px; border: 1px solid #eee;">${userName || "Citizen"}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; border: 1px solid #eee;">Issue Type</td>
              <td style="padding: 12px; border: 1px solid #eee; text-transform: capitalize;">${issueType}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 12px; font-weight: bold; border: 1px solid #eee;">Area</td>
              <td style="padding: 12px; border: 1px solid #eee;">${area}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; border: 1px solid #eee;">Location</td>
              <td style="padding: 12px; border: 1px solid #eee;">Lat: ${latitude}, Lng: ${longitude}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 12px; font-weight: bold; border: 1px solid #eee;">Description</td>
              <td style="padding: 12px; border: 1px solid #eee;">${description}</td>
            </tr>
          </table>
          ${imageUrl ? `
          <div style="margin-top: 20px; text-align: center;">
            <p style="font-weight: bold;">Attached Image:</p>
            <img src="${imageUrl}" alt="Issue Image" style="max-width: 100%; border-radius: 8px; border: 1px solid #ddd;" />
          </div>` : ""}
          <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404;">⏰ Please resolve this issue at the earliest and update the status accordingly.</p>
          </div>
        </div>
        <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #999;">
          This is an automated email from RTR - Report The Road System
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
