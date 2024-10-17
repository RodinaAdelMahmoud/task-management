import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rodinayassine21@gmail.com',
    pass: 'xanzsdgyfnwdaegt',
  },
  tls: {
    rejectUnauthorized: false, 
  },
});

export const sendOTPEmail = async (email, otp) => {
  let mailOptions = {
    from: '"rodina" <rodinayassine21@gmail.com>',
    to: email,
    subject: 'Password Reset OTP',
    html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
    return info.accepted.length > 0;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email'); 
  }
};

export const sendEmail = async (to, subject, html) => {
  let mailOptions = {
    from: '"rodina" <rodinayassine21@gmail.com>',
    to: to,
    subject: subject || 'Hello',
    html: html || '<p>Hello, World!</p>',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info.accepted.length > 0; 
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email'); 
  }
};
