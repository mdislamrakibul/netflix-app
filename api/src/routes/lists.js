const router = require("express").Router();
const List = require("../models/List");
const verify = require("../../verifyToken");


//CREATE
router.post("/", verify, async (req, res) =>
{
    if (req.user.isAdmin) {
        const newList = new List(req.body);
        try {
            const savedList = await newList.save();
            res.status(200).json({
                message: "List created successfully",
                status: true,
                data: savedList
            });
        } catch (err) {
            res.status(200).json({
                message: "List not created",
                status: false,
                data: err
            });
        }
    } else {
        res.status(200).json({
            message: "You are not authorized to perform this action",
            status: false,
            data: {}
        });
    }
});


//DELETE
router.delete("/:id", verify, async (req, res) =>
{
    if (req.user.isAdmin) {
        try {
            await List.findByIdAndDelete(req.params.id);
            res.status(200).json({
                message: "List deleted successfully",
                status: true,
                data: {}
            });
        } catch (err) {
            res.status(200).json({
                message: "List not deleted",
                status: false,
                data: err
            });
        }
    } else {
        res.status(200).json({
            message: "You are not authorized to perform this action",
            status: false,
            data: {}
        });
    }
});


//GET
router.get("/", verify, async (req, res) =>
{
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];
    try {
        if (typeQuery) {
            if (genreQuery) {
                list = await List.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: typeQuery, genre: genreQuery } },
                ]);
            } else {
                list = await List.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: typeQuery } },
                ]);
            }
        } else {
            list = await List.aggregate([{ $sample: { size: 10 } }]);
        }
        res.status(200).json({
            message: "List found",
            status: true,
            data: list
        });
    } catch (err) {
        res.status(200).json({
            message: "List not found",
            status: false,
            data: err
        });
    }
});

module.exports = router;