const db = require("../db/firebase-config");
const nodemailer = require("nodemailer");
const { hash } = require("bcrypt");
const saltRounds = 10;

exports.verify = async (data) => {
  try {
    console.log(data);
    let user = await getUser(data.email);
    console.log(user);
    if (user) {
      if (data.otp == user.otp) {
        console.log(data, user);
        return updateUser(data.email, { status: true });
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

exports.register = async (body) => {
  try {
    console.log(body);
    let user = await getUser(body.email);
    console.log("data: ", user);
    if (!user) {
      const hashedPassword = await hash(body.password, saltRounds);
      const userSaved = await db.collection("users").doc(body.email).create({
        name: body.name,
        password: hashedPassword,
        status: false,
      });
      console.log("saved", userSaved);

      if (Object.keys(userSaved).length) {
        const { otp } = await sendMail(body.email);
        const result = await updateUser(body.email, { otp });
        console.debug(result);
        return { statusCode: 200, message: result };
      }
    }
    return { statusCode: 409, message: "Already Registered !!!" };
  } catch (error) {
    throw new Error(error);
  }
};

const updateUser = async (email, body) => {
  try {
    const docRef = db.collection("users").doc(email);
    return docRef.update(body);
  } catch (error) {
    throw new Error(error);
  }
};
const getUser = async (email) => {
  try {
    console.log("email", email);
    const userRef = db.collection("users").doc(email);
    const user = await userRef.get();
    return user.data();
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
