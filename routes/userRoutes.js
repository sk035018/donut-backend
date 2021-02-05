const {
  destroyUser,
  forgotPassword,
  loginGoogle,
  loginUser,
  myProfile,
  resetPassword,
  searchUser,
  signUpUser,
  updateDP,
  updatePassword,
  updateProfile,
  uploadProfilePic,
  userProfile,
} = require("../controllers");

const {
  profileUpdateValidations,
  result,
  signUpValidation,
  updatePasswordValidations,
} = require("../validator");

module.exports = (router, authenticate, trimFields) => {
  router.get("/myprofile", authenticate, myProfile);
  router.get("/search_user/:name", authenticate, searchUser);
  router.get("/user_profile/:id", authenticate, userProfile);

  router.post("/signup", signUpValidation, result, trimFields, signUpUser);
  router.post("/login_google", loginGoogle);
  router.post("/login", loginUser);
  router.post("/forgot_password", forgotPassword);

  router.put("/update_dp", authenticate, uploadProfilePic, updateDP);
  router.put(
    "/update_password",
    authenticate,
    updatePasswordValidations,
    result,
    updatePassword
  );
  router.put(
    "/update_profile",
    authenticate,
    uploadProfilePic,
    profileUpdateValidations,
    result,
    trimFields,
    updateProfile
  );
  router.put(
    "/reset_password",
    authenticate,
    updatePasswordValidations,
    result,
    resetPassword
  );
  router.put("/user", authenticate, destroyUser);
};
