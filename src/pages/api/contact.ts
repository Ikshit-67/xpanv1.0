import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  port: Number(process.env.SMTP_PORT), // true for 465, false for other ports
  host: process.env.SMTP_HOST,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
  secure: true,
});

export default async function handleFeedback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;
    if (method === "OPTIONS") {
      return res.status(200).send("ok");
    }
    const mailData = {
      from: "minimalist.ic@gmail.com", // sender address
      to: `prtk.app.dev@gmail.com`, // list of receivers
      subject: "Message from KanjiCards User!",
     html: `<b>From: ${req.body.name}</b><br> <b>Email: ${req.body.email}</b><br/><p>Message: ${req.body.message}</p>`,
    };
    
    await transporter.sendMail(mailData, (err: any, info: any) => {
      if (err) throw new Error("Error in sending Message !");
      console.log("Message sent successfully!");
      res.status(200).json({success : true})
    });
  } catch (error) {
    console.log(`Err at POST /sendFeedback`);
    res.status(400).json({ success: false, message: `${error}` });
  }
}