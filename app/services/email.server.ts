import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "d6d0b5cfc1d9d1", // generated ethereal user
    pass: "5a97e63231aa43", // generated ethereal password
  },
});

const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  await transporter.sendMail({
    to,
    subject,
    sender: "Apex cars <info@apexcars.com>",
    html,
  });
};

export default sendEmail;
