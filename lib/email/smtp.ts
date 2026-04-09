import nodemailer from "nodemailer";

const getRequiredEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const getSmtpTransporter = () => {
  const host = getRequiredEnv("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT || "587");
  const user = getRequiredEnv("SMTP_USER");
  const pass = getRequiredEnv("SMTP_PASS");

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

export const sendSmtpMail = async (params: {
  to: string;
  subject: string;
  text: string;
}) => {
  const transporter = getSmtpTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to: params.to,
    subject: params.subject,
    text: params.text,
  });
};

