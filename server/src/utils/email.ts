import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

// Nodemailer setup
const auth = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});

// Path to emails ejs templates
const emailsPath = path.resolve(__dirname, '..', 'views', 'emails');

const resetPasswordEmailTemplatePath = path.join(
  emailsPath,
  'resetPasswordEmail.ejs',
);
const signUpEmailTemplatePath = path.join(emailsPath, 'signupEmail.ejs');
const signInEmailTemplatePath = path.join(emailsPath, 'signinEmail.ejs');
const deleteAccountTemplatePath = path.join(
  emailsPath,
  'deleteAccountEmail.ejs',
);

interface IEmailParams {
  redirectToEmailVerificationPageLink: string;
}

type EmailType = 'reset password' | 'sign up' | 'sign in' | 'delete account';

const sendMail = async (
  email: string, 
  type: EmailType, 
  subject: string, 
  params: IEmailParams
): Promise<void> => {
  try {
    // Render the EJS template
    let html: string;
    
    switch (type) {
      case 'reset password':
        html = await ejs.renderFile(resetPasswordEmailTemplatePath, {
          redirectToEmailVerificationPageLink: params.redirectToEmailVerificationPageLink,
        });
        break;
      case 'sign up':
        html = await ejs.renderFile(signUpEmailTemplatePath, {
          redirectToEmailVerificationPageLink: params.redirectToEmailVerificationPageLink,
        });
        break;
      case 'sign in':
        html = await ejs.renderFile(signInEmailTemplatePath, {
          redirectToEmailVerificationPageLink: params.redirectToEmailVerificationPageLink,
        });
        break;
      case 'delete account':
        html = await ejs.renderFile(deleteAccountTemplatePath);
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
    
  } catch (error:unknown) {
     const errorMessage =
      error instanceof Error
        ? error.message
        : 'Error sending mail';
     throw new Error(errorMessage);
  }
};

export default sendMail;

