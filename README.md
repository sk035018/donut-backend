# donut-backend

#  root/
     ===> index.js ## This is the entry point of the project
     ===> example.env ## This is a copy of .env file fields
    
#    routes/
       ===> index.js ## All the end points are in this file
    
#    middlewares/
        ===> index.js ## All the middlewares are in this file
    
#    controllers/
        ===> index.js
        ===> commentController.js
        ===> postController.js
        ===> uploadController.js ## Multer Related code is in this file
        ===> userController.js
    
#    services/
        ===> index.js ## All the calls of sequelize ORM are in these files
        ===> commentService
        ===> postService
        ===> userService
    
#    uploads/
        ===> posts/ ## All the post media saves in this folder
        ===> profile/ ## All the profile pictures of users will save in this folder
    
#    utils/
        ===> index.js ## All the utility functions are defined in this file
    
#    validator/
        ===> index.js ## All the validations are defined in this file
        ===> multerValidations.js
        ===> utility.js ## All the utility functions related to validations are in this file