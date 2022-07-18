const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const verify = require("../../verifyToken");

var log4js = require("log4js");
var logger = log4js.getLogger("auth api");
log4js.configure({
    appenders: { console: { type: "console" } },
    categories: { default: { appenders: ["console"], level: "info" } },
});

//UPDATE
router.put("/:id", verify, async (req, res) =>
{
    if (req.user.id === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            req.body.password = req.body.password
            req.body.cryptPassword = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.SECRET_KEY
            ).toString();
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            logger.info('update password - success ...');
            const { password, cryptPassword, __v, ...info } = updatedUser._doc;

            res.status(200).json({
                message: "User updated successfully",
                data: { ...info },
                status: true
            });
        } catch (err) {
            logger.error('update password - error !!!');
            res.status(500).json({
                message: "User not updated successfully",
                data: err,
                status: false
            });
        }
    } else {
        res.status(403).json("You can update only your account!");
    }
});


//DELETE
router.delete("/:id", verify, async (req, res) =>
{
    if (req.user.id === req.params.id || req.user.isAdmin) {
        try {
            // await User.findByIdAndDelete(req.params.id);
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            logger.info('delete user - success ...');
            const { password, cryptPassword, __v, ...info } = users._doc;
            res.status(200).json({
                message: "User has been deleted...",
                data: { ...info },
                status: true
            });
        } catch (err) {
            logger.error('delete user - error !!!');
            res.status(500).json({
                message: "User has not been deleted...",
                data: err,
                status: false
            });
        }
    } else {
        res.status(403).json("You can delete only your account!");
    }
});


//GET
router.get("/find/:id", async (req, res) =>
{
    try {
        const user = await User.findById(req.params.id);
        const { password, cryptPassword, __v, ...info } = user._doc;
        logger.info('get user by id - success');
        res.status(200).json({
            message: "User found successfully",
            data: { ...info },
            status: true
        });
    } catch (err) {
        logger.error('get user by id - error');
        res.status(500).json({
            message: "User not found",
            data: err,
            status: false
        });
    }
});



//GET ALL
router.get("/", verify, async (req, res) =>
{
    const query = req.query.new;
    if (req.user.isAdmin) {
        try {
            const users = query
                ? await User.find().sort({ _id: -1 }).limit(5)
                : await User.find();
            logger.info('fetch users - success ...');
            // const { password, cryptPassword, __v, ...info } = users._doc;
            res.status(200).json({
                message: "Users fetched successfully",
                data: users,
                status: true
            });
        } catch (err) {
            logger.info('fetch users - error !!!');
            res.status(500).json({
                message: "Users not fetched successfully",
                data: err,
                status: false
            });
        }
    } else {
        res.status(403).json("You are not allowed to see all users!");
    }
});



//GET USER STATS
router.get("/stats", async (req, res) =>
{
    const today = new Date();
    const latYear = today.setFullYear(today.setFullYear() - 1);

    try {
        const data = await User.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json({
            status: true,
            data: data,
            'message': 'User stats fetched successfully'
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            data: err,
            'message': 'User stats not fetched successfully'
        });
    }
});

module.exports = router;