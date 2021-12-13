const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const usersFile = path.join(__dirname, '../data/users.json');
const User = require('../modelsUsers/User')
const {validationResult} =require('express-validator');
const bcryptjs = require('bcryptjs');
const db = require('../database/models')

const controller = {
    
    index:function(req, res) {
        let users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
        res.render('./user/user-table', {users: users});
    },

  delete: function (req, res) {
    let id = req.params.id;
    let users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    let finalUsers = users.filter((user) => user.id != id);
    fs.writeFileSync(usersFile, JSON.stringify(finalUsers, null, " "));
    res.redirect("/users");
  },

  edit: function (req, res) {
    let userId = req.params.id;
    let users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    let editUser = users.filter((user) => user.id == userId);
    console.log(editUser[0].firstName);
    res.render("./user/user-edit", { user: editUser[0] });
  },

  put: function (req, res) {
    let id = req.params.id;
    let users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    let userToEdit = users.find((user) => user.id == id);

    userToEdit = {
      id: userToEdit.id,
      ...req.body,
    };
    console.log(req.body);
    console.log(userToEdit);
    let newUsers = users.map((user) => {
      if (user.id == userToEdit.id) {
        return (user = { ...userToEdit });
      }
      return user;
    });

    console.log(newUsers);

    fs.writeFileSync(usersFile, JSON.stringify(newUsers, null, " "));

    res.redirect("/users");
  },
  register: function (req, res) {
    res.render("./user/register");
  },

  create: function (req, res) {
    console.log("ENTRE");
    let userCompare = db.User.findOne({where:{email: req.body.email}});

    if(userCompare) {
        return res.render('./user/register', {
            errors: {
                email: {
                        msg:'Este mail ya esta registrado'
                }
            },
            oldData: req.body
        });
    }else{
		db.User.create({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        image: req.body.image,
        admin: req.body.admin
      });
		res.redirect('/');
    }},

    register:(req , res) => res.render('./user/register'),

    processRegister:function(req, res) {

        const resultValidation = validationResult(req);

        if (resultValidation.errors.length > 0){
            return res.render('./user/register', {
            errors: resultValidation.mapped(),
            oldData: req.body
        });
    }

    let userInDb = User.findByField('email',req.body.email);

    if (userInDb) {
        return res.render('./user/register', {
        errors: {
            email:{
                msg: 'Este email ya esta registrado'
            }
        },
        oldData: req.body
        });
    }

     let userToCreate = {
         ...req.body,
         password: bcryptjs.hashSync(req.body.password,10),
         image: req.file.filename
     }
     User.create(userToCreate);
     return res.send('ok, se creo el usuario');
    },

    login:function(req, res) {
        return res.render('./user/login');
    },

    loginProcess:function(req, res) {
        let userToLogin = User.findByField('email',req.body.email);

        if (userToLogin){
            let isOkThePassword = bcryptjs.compareSync(req.body.password,userToLogin.password);
            if (isOkThePassword){
                delete userToLogin.password;
                req.session.userLogged = userToLogin;
                if(req.body.remember_user){
                    res.cookie('userEmail',req.body.email,{maxAge:(1000*60)*2})
                }
                return res.redirect('/users/profile');
            }     
        }

        return res.render('./user/login',{
            errors:{
                email:{
                    msg:'Las credenciales son invalidas'
                }
            }  
        });
    },

    profile:function(req, res) {

        console.log(req.cookies.userEmail);

        return res.render('./user/profile',{
            user: req.session.userLogged
        });
    },

    logout:function(req, res) {
        res.clearCookie('userEmail');
        req.session.destroy();
        return res.redirect('/');
    },
}

module.exports = controller;
