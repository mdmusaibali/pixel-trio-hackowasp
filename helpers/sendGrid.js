import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = ({ to, subject, text }) => {
  const msg = {
    to,
    from: "musaib@hospaid.in",
    subject,
    text,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log(`Email sent to ${to}`);
    })
    .catch((error) => {
      console.log("Email sending failed", error);
    });
};
