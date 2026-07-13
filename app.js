const express = require('express');
const app = express();
const userModel = require('./models/user');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const SECRET_KEY = 'shhhhhhh';

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', async function(req, res){
    let users = await userModel.find();
    res.render('index', { users });
});
app.post('/create', async (req, res) => {
    let {name, email,password,image,createdAt} =req.body;
   
    const existingUser = await userModel.findOne({email});
    if(existingUser){
        return res.send('User already exists');
    }
        const hashedPassword = await bcrypt.hash(password, 10);
        let createdUser= await userModel.create({
            name,
            email,
            password:hashedPassword,
            image,
            createdAt
        })
        console.log(createdUser);
        res.redirect('/');
    
})

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });

    if (!user) {
        return res.render('login', { error: 'Invalid Email or Password' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.render('login', { error: 'Invalid Email or Password' });
    }
     const token = jwt.sign({
        id:user._id,
        email:user.email
     },SECRET_KEY,{
        expiresIn:'1d'
     })
     res.cookie('token',token,{
        httpOnly:true,
        maxAge:1000*60*60*24*30
     })
    res.redirect('/dashboard');
});
app.get('/dashboard', async (req, res) => {
    const token = req.cookies.token;
    if(!token){
        return res.redirect('/login');
    }
    try{
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await userModel.findById(decoded.id);
        res.render('dashboard', { user });
        console.log(user.name);
    }catch(error){
        return res.redirect('/login');
    }
})






app.get("/logout", (req, res) => {

    res.clearCookie("token");

    res.redirect("/");

});
app.listen(3000);


