const db = require("../db/firebase-config");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcrypt");
const saltRounds = 10;

exports.resetPassword = async (data) => {
  console.log(data.password);
  const hashedPassword = await hash(data.password, saltRounds);
  console.log(hashedPassword);
  const result = await updateUser(data.email, { password: hashedPassword });
  if (result) {
    return { statusCode: 200, message: "Password Successfully Changed" };
  }
};

exports.forgotPassword = async (data) => {
  let user = await getUser(data.email);
  if (user) {
    const message = {
      html: `<p>To Reset Your Password <a href='http://localhost:3000/reset-password?${data.email}'>Click Here</a></p>`,
    };
    await sendMail(data.email, message);
    return { statusCode: 200 };
  }
};

exports.verify = async (data) => {
  try {
    let user = await getUser(data.email);
    console.log("festched", user);
    if (user) {
      if (data.otp == user.otp) {
        console.log("if", data, user);
        await updateUser(data.email, { status: true });

        const token = jwt.sign({ email: data.email }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });
        console.log("token", token);
        return {
          statusCode: 200,
          token,
          message: "Successfully Registered !!!",
        };
      }

      return { statusCode: 401, message: "Invalid OTP !!!" };
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
        let otp = generateOtp();
        const message = { text: `Your OTP is ${otp}` };
        await sendMail(body.email, message);
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

exports.login = async (body) => {
  try {
    let user = await getUser(body.email);
    const match = await compare(body.password, user.password);
    console.log(match);
    if (match) {
      if (user.status) {
        const token = jwt.sign({ email: body.email }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });
        console.log(token);

        return {
          statusCode: 200,
          token,
          message: "SuccessFully Logged In !!!",
        };
      }
      return { statusCode: 401, message: "Email Is Not Verified Yet !!!" };
    }
    return { statusCode: 401, message: "Email or Password is not correct !!!" };
  } catch (error) {
    throw new Error(error);
  }
};

const updateUser = async (email, body) => {
  try {
    console.log(email, body);
    const docRef = db.collection("users").doc(email);
    console.log(docRef);
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

const sendMail = async (email, message) => {
  console.log(email);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  console.log(transporter);

  let options = {
    from: "code@gmail.com",
    to: email,
    subject: "Email Verification",
    ...(message.text && { text: message.text }),
    ...(message.html && { html: message.html }),
  };

  let info = await transporter.sendMail(options);

  console.log(info);

  return info;
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
