const mongoose = require("mongoose");
const Coder = mongoose.model("Coder");
const nodemailer = require("nodemailer");

exports.register = async (body) => {
  try {
    const userSaved = await Coder.create({
      name: body.name,
      email: body.email,
    });
    console.log(userSaved);

    if (Object.keys(userSaved).length) {
      const { otp } = await sendMail(body.email);
      const result = await Coder.findOneAndUpdate(
        { email: body.email },
        { otp },
        { new: true }
      );
      console.debug(result);
      return result;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const sendMail = async (email) => {
  console.log(email);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  console.log(transporter);

  let otp = generateOtp();

  let options = {
    from: "code@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Your One Time Password is ${otp}`,
  };

  let info = await transporter.sendMail(options);

  console.log(info);

  return { info, otp };
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
