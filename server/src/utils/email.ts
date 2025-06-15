import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

interface IEmailParams {
  redirectToEmailVerificationPageLink?: string;
  redirectToResetPasswordPageLink?: string;
}

type EmailType = 'reset password' | 'sign up' | 'sign in';

const sendMail = async (
  email: string,
  type: EmailType,
  subject: string,
  params: IEmailParams,
): Promise<void> => {
  // Nodemailer setup
  const auth = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_EMAIL_PASSWORD,
    },
  });
  const emailTemplatesDir = path.join(process.cwd(), 'dist/views/emails');
  const resetPasswordEmailTemplatePath = path.join(
    emailTemplatesDir,
    'resetPasswordEmail.ejs',
  );
  const signUpEmailTemplatePath = path.join(emailTemplatesDir, 'signUpEmail.ejs');
  const signInEmailTemplatePath = path.join(emailTemplatesDir, 'signinEmail.ejs');

  try {
    let html: string;

    switch (type) {
      case 'reset password':
        html = await ejs.renderFile(resetPasswordEmailTemplatePath, {
          redirectToResetPasswordPageLink:
            params.redirectToResetPasswordPageLink,
        });
        break;
      case 'sign up':
        html = await ejs.renderFile(signUpEmailTemplatePath, {
          redirectToEmailVerificationPageLink:
            params.redirectToEmailVerificationPageLink,
        });
        break;
      case 'sign in':
        html = await ejs.renderFile(signInEmailTemplatePath, {
          redirectToEmailVerificationPageLink:
            params.redirectToEmailVerificationPageLink,
        });
        break;
      default:
        throw new Error(`Invalid email type: ${type}`);
    }

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject,
      html,
    };

    await auth.sendMail(mailOptions);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error sending mail';
    throw new Error(errorMessage);
  }
};

export default sendMail;