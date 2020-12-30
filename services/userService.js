const bcrypt = require("bcrypt");

const { generateJwt, sendMail, deleteFile } = require("../utils");
const { users } = require("../models");

module.exports = {
  loginUserService: async ({ userName = "", email = "", password }) => {
    try {
      let checkValidUser;

      if (userName)
        checkValidUser = await users.findOne({ where: { userName } });

      if (email) checkValidUser = await users.findOne({ where: { email } });

      if (!checkValidUser)
        return { statusCode: 404, message: "Username or Password is incorrect!!!" };

      const result = await bcrypt.compare(
        String(password),
        checkValidUser.password
      );

      if (result) {
        const token = generateJwt({
          email: checkValidUser.email,
          userName: checkValidUser.userName,
        });

        return {
          name: "token",
          value: token,
          statusCode: 200,
          message: "You have been logged in successfully!!!",
        };
      } else return { statusCode: 401, message: "Username or Password is incorrect!!!" };
    } catch (err) {
      throw err;
    }
  },

  signUpUserService: async ({ password, email, ...rest }) => {
    try {
      const hash = await bcrypt.hash(String(password), 10);
      await users.create({ ...rest, email, password: hash });

      const html = `<html>
                      <body>
                        <div style = 'text-align: center; background-color: cadetblue; color: white; padding: 25px'>
                          <h1>Hi ${rest.fullName}, You are now the part of WeConnect ...</h1>
                          <h3>Your Username is : ${rest.userName}</h3>
                          <h3>Your Password is : ${password}</h3>
                        </div>
                      </body>
                    </html>`;

      sendMail({
        to: email,
        subject: `WeConnect Welcome You ${rest.fullName} ...`,
        html,
      });

      return {
        name: "user",
        value: { ...rest, email },
        statusCode: 201,
        message: "You have been signed up successfully!!!",
      };
    } catch (err) {
      throw err;
    }
  },

  updateDPService: async (id, profilePic) => {
    try {
      if (profilePic) {
        const user = await users.findOne({ where: { id } });
        user.profilePic = profilePic;
        await user.save();
      } else throw new Error("Choose an Image First");

      return {
        statusCode: 201,
        message: "Updated Profile Pic Successfully",
      };
    } catch (err) {
      throw err;
    }
  },

  destroyUserService: async (id, password) => {
    try {
      const user = await users.findOne({ where: { id } });

      const result = await bcrypt.compare(String(password), user.password);

      if(result) {
        if (user.profilePic) {
          deleteFile(user.profilePic).catch(err => { throw err; });
        }
        await user.destroy();
        return {
          statusCode: 201,
          message: "Account Deleted Successfully",
        };
      } else {
        return {
          statusCode: 401,
          message: "Invalid Password",
        }
      }
    } catch (error) {
      throw error;
    }
  },

  updateProfileService: async (id, newData) => {
    try {
      const user = await users.findOne({ where: { id } });
      Object.keys(newData).forEach((key) => (user[key] = newData[key]));
      await user.save();
      return {
        statusCode: 201,
        message: "Updated Profile Successfully",
      };
    } catch (error) {
      throw error;
    }
  },

  updatePasswordService: async (id, { oldPassword, newPassword }) => {
    try {
      const currentUser = await users.findOne({ where: { id } });
      const result = await bcrypt.compare(
        String(oldPassword),
        currentUser.password
      );
      if (result) {
        const password = await bcrypt.hash(String(newPassword), 10);
        currentUser.password = password;
        await currentUser.save();
        return {
          statusCode: 201,
          message: "Updated Password Successfully",
        };
      } else {
        throw new Error("Invalid Password");
      }
    } catch (error) {
      throw error;
    }
  },
};