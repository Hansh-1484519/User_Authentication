const express = require('express');
const mongoose = require('mongoose')
const user = require('../Models/user');
const router = express.Router();
const bcrypt = require('bcrypt');

// login handle
router.get('/login' , (req ,res) => {
    res.render('login');
}) 
router.post('/login' , async (req ,res) => {
    try{

        const { username , password } = req.body;
        const User = await user.findOne( { username : username });
        !User && res.json('Wrong Credentials !')
        if(User){
            bcrypt.compare(password , User.password, (err , isMatch) => {
                if( err) throw err;
                if( isMatch )
                {
                    res.send( " You are loged In ");
                }
                else{      
                    res.send("You have entered a wrong password ");
                }
            })
        }
    } catch (err) {
            res.status(500).json(err);
    }
})

// register handle
router.post('/register' , async ( req , res) => {
    try{
       const {username,email, password} = req.body;
       // Technique 1 (generate a salt and hash on separate function calls):
       // if( !username || !email || !password){
       //     res.send("fill all the details");
       // }
       // else{     
           console.log("user" + username);
           const User = await user.findOne( { username : username });
           if( User ){
                if( User.email === email)
                res.send("User already exists")
            }
            else{

                const newUser = new user ({
                    username  : username,
                    email : email,
                    password : password
                })
                
                bcrypt.genSalt(10 , (err , salt) => 
                bcrypt.hash(newUser.password , salt , (err , hash) => {
                    if( err ) throw err;
                    newUser.password = hash;
                    newUser.save().then((value) => {
                        console.log(value)
                        res.json(newUser);
                       // res.redirect('/login');
                    }).catch( value => console.log( value));
                }));
                console.log(newUser.password);
            }
       // }
        //  const User =  newUser.save();
    } catch(err) {
        res.status(500).json(err)
    }
})

// logout

module.exports = router;