const { users } = require("../models");
const { body, validationResult } = require("express-validator");

const checkExisting = async (email, userName) => {
    let existingUser;
  
    if (email) existingUser = await users.findOne({ where: { email } });
    if(userName) existingUser = await users.findOne({ where: { userName } });
  
    return Boolean(existingUser);
  };
  
  const validateNotEmpty = (fieldNamesArray) => {
    return fieldNamesArray.map((fieldName) =>
      body(fieldName)
        .notEmpty()
        .withMessage(`${fieldName.toUpperCase()} cannot be empty`)
    );
  };

  const validateIsEmpty = (fieldNamesArray) => {
    return fieldNamesArray.map((fieldName) =>
      body(fieldName)
        .isEmpty()
        .withMessage(`${fieldName.toUpperCase()} cannot update here`)
    );
  };

  const passwordValidations = (fieldName) => {
    return [
      body(fieldName)
        .isLength({ min: 6, max: 15 })
        .withMessage("Password must be 6-15 character long"),
  
      body(fieldName).custom((password) => {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s)/;
        if (!String(password).match(regex))
          throw new Error(
            "Password must be combination of uppercase, lowercase, numeric and special character"
          );
        else return true;
      }),
    ];
  };

  module.exports = {
      body,
      checkExisting,
      validateIsEmpty,
      validateNotEmpty,
      validationResult,
      passwordValidations,
  }