import { NextResponse } from "next/server";
import emailjs from "@emailjs/nodejs";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      firstName,
      lastName,
      email,
      subject,
      message,
    } = data;

    console.log("📨 Incoming form data:", data);

    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      {
        firstName,
        lastName,
        email,
        subject,
        message,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY!,
      }
    );

    console.log("📧 EmailJS Response:", response);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("🔥 Email sending failed:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
