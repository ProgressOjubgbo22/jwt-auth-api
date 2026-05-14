const express = require('express');
const router = express.Router();
const {auth, generateToken, authAdmin} = require('../middleware/auth');
const bcrypt = require('bcrypt');
const User = require('../model/user');

//Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if(existingUser) {
            return res.status(400).json({message: "user already exists"});
        }
        const hashedPasword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPasword
        });
        await newUser.save();
        res.status(201).json({message: "user registered successfully"});
    }
    catch(err) {
        console.error(err); 
        res.status(500).json({message: "server error"});     
    }
});

//login user
router.post('/login', async(req, res) => {
    const {email, password} = req.body;

    try{
        const existingUser = await User.findOne({email});
        if(!existingUser){ 
            return res.status(404).json({message: "user not found"});
        }
        const ispasswordMatch = await bcrypt.compare(password, existingUser.password);
        if(!ispasswordMatch){
            return res.status(400).json({message: "invalid credentils"});
        }
            const token = generateToken(existingUser._id);
            res.status(200).json({token});
            }
        
    catch(err){
        console.error(err);
        res.status(500).json({message: "server error"});
}
});

//get user profile
router.get('/profile', auth, async(req, res) => {
    try{
        const userProfile = req.user;
        res.status(200).json({userProfile});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({message: "server error"});
    }
}); 

//update user profile
router.put('/profile', auth, async(req, res) => {
    const {username, email} = req.body;
    try{
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {username, email}, {new: true});
        res.status(200).json({updatedUser});
    } 
    catch(err) {
        console.error(err);
        res.status(500).json({message: "server error"});
    }
})

//delete user profile
router.delete('/profile', auth, async(req, res) => {
    try{
        await User.findByIdAndDelete(req.user._id);
        res.status(200).json({message: "user profile deleted successfully"});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

//logout user
router.post('/logout', auth, async(req, res) => {
    try{
        res.status(200).json({message: "user logged out successfully"});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({message: "server error"});
    }
})

//change password
router.post('/change-password', auth, async(req, res) => {
    const {oldPassword, newPassword} = req.body;
    try{
        const ispasswordMatch = await bcrypt.compare(oldPassword, req.user.password);
        if(!ispasswordMatch) {
            return res.status(400).json({message: "old password is incorrect"}); 
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        req.user.password = hashedNewPassword;
        await req.user.save();
        res.status(200).json({message: "password changed successfully"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

//forgot password
router.post('/forgot-password', async(req, res) => {
    const {email} = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(!existingUser) {
            return res.status(404).json({message: "user not found"});
        }
        //generate reset token and send email logic here
        res.status(202).json({message: "password reset link sent to email"});
    }
    catch(err){
        console.error(err)
        res.status(500).json({message: "Server error"});
    }
})

//reset password
router.post('/reset-password', async(req, res) => {
    const {token, newPassword} = req.body;
    try{

        //verify reeset token logic here
        const resetToken = await resetToken.findOne({token});
        if(!resetToken) {
            return res.status(400).json({message: "invalid or expired reset token"});
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        //update user password logic here
        await User.findByIdAndUpdate(resetToken.userId, {password: hashedNewPassword});
        res.status(200).json({message: "password reset successfully"});
       
    }
    catch(err) {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
})

//refresh token
router.post('/refresh-token', auth, async(req, res) => {
    try{
        const newToken = generateToken(req.user._id);
        res.status(200).json({token: newToken});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
})


//get all users(admin only)
router.get('/users', auth, authAdmin, async(req, res) => {
    try{
        if(req.user.role !== 'admin') {
            return res.status(403).json({message: "access denied"});
        }
        const users = await User.find();
        res.status(200).json({users});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({message: "server error"});
    }
})

//delete user(admin only)
router.delete('/users/:id', auth, authAdmin, async(req, res) => {
    try{
        if(req.user.role !== 'admin') {
            return res.status(403).json({message: "access denied"});
        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "user deleted successfully"});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({message: "server error"});
    }
})

//update user role(admin only)
router.put('/users/:id/role', auth, authAdmin, async(req, res) => {
    const {role} = req.body;
    try{
        if(req.user.role !== 'admin') {
            return res.status(403).json({message: "access denied"});
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {role}, {new: true});
        res.status(200).json({updatedUser});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({message: "server error"});
    }
})


module.exports =router;
