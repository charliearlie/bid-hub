import { Resend } from "resend";
import type { CreateEmailResponse } from "resend/build/src/emails/interfaces";

const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<CreateEmailResponse> => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const data = await resend.emails.send({
    from: "Bidhub <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  return data;
};

export default sendEmail;
