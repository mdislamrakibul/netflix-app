const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

/** REGISTER */
router.post('/register', async (req, res) =>
{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cryptPassword: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
    });
    try {
        const user = await newUser.save();
        res.status(201).json({ 'status': true, 'code': 200, 'user': user });
    } catch (err) {
        res.status(500).json(err);
    }
})

//LOGIN
router.post("/login", async (req, res) =>
{
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(401).json({
            "status": false,
            "code": 401,
            "message": "Wrong User!!!"
        });

        const bytes = CryptoJS.AES.decrypt(user.cryptPassword, process.env.SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        originalPassword !== req.body.password &&
            res.status(401).json({
                "status": false,
                "code": 401,
                "message": "Wrong Password!!!"
            });

        const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.SECRET_KEY,
            { expiresIn: "5d" }
        );

        const { password, cryptPassword, __v, ...info } = user._doc;

        res.status(200).json({ ...info, accessToken });
    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;