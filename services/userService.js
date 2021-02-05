const bcrypt = require("bcrypt");

const {
  sendMail,
  deleteFile,
  generateJwt,
  toPascalCase,
  generatePassword,
  stringifyMe,
} = require("../utils");

const {
  Users,
  Posts,
  Likes,
  Friends,
  Comments,
  Sequelize,
  transaction,
  Notifications,
} = require("../models");

const { destroyPostService } = require("./postService");
const { friendList } = require("./utils");
const { isOnline } = require("../socket");

module.exports = {
  loginUserService: async ({
    userName = "",
    email = "",
    password,
    expiresIn,
  }) => {
    try {
      let checkValidUser;

      if (userName) {
        checkValidUser = await Users.findOne({ where: { userName } });
      }

      if (email) checkValidUser = await Users.findOne({ where: { email } });

      if (!checkValidUser)
        return {
          statusCode: 401,
          message: "Username or Password is incorrect!!!",
        };

      const result = await bcrypt.compare(
        String(password),
        checkValidUser.password
      );

      if (result) {
        const token = generateJwt(
          {
            email: checkValidUser.email,
            userName: checkValidUser.userName,
          },
          expiresIn
        );

        return {
          name: "token",
          value: token,
          statusCode: 200,
          message: "You have been logged in successfully!!!",
        };
      } else
        return {
          statusCode: 401,
          message: "Username or Password is incorrect!!!",
        };
    } catch (err) {
      throw err;
    }
  },

  loginGoogleService: async (
    { email, name: fullName, email_verified },
    expiresIn
  ) => {
    try {
      if (!email_verified) {
        return {
          statusCode: 401,
          message: "Unable to Login with this Account !!!",
        };
      }

      const checkValidUser = await Users.findOne({ where: { email } });

      if (checkValidUser) {
        const token = generateJwt(
          {
            email: checkValidUser.email,
            userName: checkValidUser.userName,
          },
          expiresIn
        );

        return {
          name: "token",
          value: token,
          statusCode: 200,
          message: "You have been logged in Successfully!!!",
        };
      } else {
        await module.exports.signUpUserService({
          email,
          fullName,
          userName: email.substring(0, email.indexOf("@")),
          password: generatePassword(),
        });
        return await module.exports.loginGoogleService({
          email,
          email_verified: true,
        });
      }
    } catch (err) {
      throw err;
    }
  },

  signUpUserService: async ({ password, email, ...rest }) => {
    try {
      const hash = await bcrypt.hash(String(password), 10);
      await Users.create({ ...rest, email, password: hash });

      const html = `<html>
                      <body>
                        <div style = 'text-align: center; background-color: cadetblue; color: white; padding: 25px'>
                          <h1>Hi ${rest.fullName}, You are now the part of WeConnect ...</h1>
                          <h3>Your Username is : ${rest.userName}</h3>
                          <h3>Your Password is : ${password}</h3>
                        </div>
                      </body>
                    </html>`;

      await sendMail({
        to: email,
        subject: `WeConnect Welcome You ${rest.fullName} ...`,
        html,
      });

      return {
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
        const user = await Users.findOne({ where: { id } });
        user.profilePic = profilePic;
        await user.save();
      } else {
        return {
          statusCode: 404,
          message: "Choose an Image First !!!",
        };
      }

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
      const user = await Users.findOne({ where: { id } });

      const result = await bcrypt.compare(String(password), user.password);

      if (result) {
        const friendsId = await friendList(id);

        return await transaction(async (transaction) => {
          if (user.profilePic) {
            await deleteFile(process.env.DP_FILE_PATH + user.profilePic);
          }

          const userPosts = await Posts.findAll({ where: { userId: id } });

          for (let i = 0; i < userPosts.length; i++) {
            try {
              const post = userPosts[i];
              await destroyPostService(id, post.id, post);
            } catch (err) {
              throw err;
            }
          }

          await Likes.destroy({ where: { userId: id } }, { transaction });
          await Comments.destroy({ where: { userId: id } }, { transaction });
          await Friends.destroy(
            {
              where: Sequelize.or({ user1: id }, { user2: id }),
            },
            { transaction }
          );
          await Users.decrement(
            { total_friends: 1 },
            { where: { id: friendsId } },
            { transaction }
          );
          await Notifications.destroy({
            where: Sequelize.or({ from: id }, { to: id }),
          });
          await user.destroy({ transaction });

          return {
            statusCode: 201,
            message: "Account Deleted Successfully",
          };
        });
      } else {
        return {
          statusCode: 401,
          message: "Invalid Password",
        };
      }
    } catch (err) {
      throw err;
    }
  },

  updateProfileService: async (id, newData) => {
    try {
      const user = await Users.findOne({ where: { id } });
      Object.keys(newData).forEach((key) => (user[key] = newData[key]));
      await user.save();
      return {
        statusCode: 200,
        message: "Updated Profile Successfully",
      };
    } catch (err) {
      throw err;
    }
  },

  updatePasswordService: async (id, { oldPassword, newPassword }) => {
    try {
      const currentUser = await Users.findOne({ where: { id } });
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
        return {
          statusCode: 401,
          message: "Invalid Password",
        };
      }
    } catch (err) {
      throw err;
    }
  },

  forgotPasswordService: async (email) => {
    try {
      const checkUser = await Users.findOne({
        where: { email },
        attributes: ["id", "email"],
      });
      if (!checkUser)
        return {
          statusCode: 404,
          message: "Email is not registered in this site...",
        };

      const resetToken = generateJwt(
        { email: checkUser.email, id: checkUser.id },
        "15*60*1000"
      );

      await sendMail({
        to: checkUser.email,
        subject: "WECONNECT FORGOT PASSWORD LINK",
        html: `<html>
                <body>
                  <div style = 'text-align: center; background-color: cadetblue; color: white; padding: 25px'>
                    <h1>Hello ${checkUser.fullName},</h1>
                    <h3>Click on this link in order to reset your password :</h3>
                    <h3><a href='http://localhost:3000/home/reset_password/${resetToken}>Weconnect Forgot Password Link'</h3>
                    <h6>NOTE: Link is valid only for 15 minutes </h6>
                  </div>
                </body>
              </html>`,
      });
      return {
        statusCode: 200,
        message: "Email Sent Successfully !!!",
      };
    } catch (err) {
      throw err;
    }
  },

  resetPasswordService: async (id, newPassword) => {
    try {
      const password = await bcrypt.hash(String(newPassword), 10);
      await Users.update({ password }, { where: { id } });
      return { statusCode: 200, message: "Password updated successfully!!!" };
    } catch (err) {
      throw err;
    }
  },

  searchUserService: async (id, name) => {
    try {
      const _name = name.indexOf(" ") === -1 ? name.trim() : toPascalCase(name);
      let userList = await Users.findAll({
        where: Sequelize.or(
          { userName: name },
          { fullName: { [Sequelize.Op.iLike]: name + "%" } }
        ),
        attributes: { exclude: ["password"] },
      });
      userList = stringifyMe(userList);
      const friendsId = await friendList(id);

      for (let i = 0; i < userList.length; ++i) {
        const mutualFriends = await Friends.findAll({
          where: {
            ...Sequelize.or(
              { user1: friendsId, user2: userList[i].id },
              { user1: userList[i].id, user2: friendsId }
            ),
            accepted: true,
          },
          attributes: ["user1", "user2"],
        });

        const mutualFriendsId = stringifyMe(
          mutualFriends
        ).map(({ user1, user2 }) => (userList[i].id === user1 ? user2 : user1));

        userList[i].mutualFriends = mutualFriendsId;
      }

      return {
        statusCode: 200,
        name: "userList",
        value: userList,
      };
    } catch (err) {
      throw err;
    }
  },

  userProfileService: async (id) => {
    try {
      const user = await Users.findOne({
        where: { id },
        attributes: ["id", "fullName", "userName", "profilePic", "activeAt"],
      });
      const profile = stringifyMe(user);
      profile.isOnline = isOnline[id];
      return {
        statusCode: 200,
        name: "profile",
        value: profile,
      };
    } catch (err) {
      throw err;
    }
  },
};
