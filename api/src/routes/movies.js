const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../../verifyToken");

//CREATE
router.post("/", verify, async (req, res) =>
{
    if (req.user.isAdmin) {
        const newMovie = new Movie(req.body);
        try {
            const savedMovie = await newMovie.save();
            res.status(201).json({
                message: "Movie created successfully",
                status: true,
                data: savedMovie
            });
        } catch (err) {
            res.status(200).json({
                message: "Movie not created",
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


//UPDATE
router.put("/:id", verify, async (req, res) =>
{
    if (req.user.isAdmin) {
        try {
            const updatedMovie = await Movie.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            res.status(200).json({
                message: "Movie updated successfully",
                status: true,
                data: updatedMovie
            });
        } catch (err) {
            res.status(200).json({
                message: "Movie not updated",
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
            await Movie.findByIdAndDelete(req.params.id);
            res.status(200).json({
                message: "Movie deleted successfully",
                status: true,
                data: {}
            });
        } catch (err) {
            res.status(200).json({
                message: "Movie not deleted",
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
router.get("/find/:id", verify, async (req, res) =>
{
    try {
        const movie = await Movie.findById(req.params.id);
        if (movie) {
            res.status(200).json({
                message: "Movie found",
                status: true,
                data: movie
            });
            return
        }
        res.status(200).json({
            message: "Movie not found",
            status: true,
            data: {}
        });
    } catch (err) {
        res.status(200).json({
            message: "Movie not found",
            status: false,
            data: err
        });
    }
});


//GET RANDOM
router.get("/random", verify, async (req, res) =>
{
    const type = req.query.type;
    let movie;
    try {
        if (type === "series") {
            movie = await Movie.aggregate([
                { $match: { isSeries: true } },
                { $sample: { size: 1 } },
            ]);
        } else {
            movie = await Movie.aggregate([
                { $match: { isSeries: false } },
                { $sample: { size: 1 } },
            ]);
        }
        if (movie.length) {
            res.status(200).json({
                message: `${type} found`,
                status: true,
                data: movie
            })
            return
        }
        res.status(200).json({
            message: "Nothing found",
            status: false,
            data: {}
        });
    } catch (err) {
        res.status(200).json({
            message: "Nothing found",
            status: false,
            data: err
        });
    }
});


//GET ALL
router.get("/", verify, async (req, res) =>
{
    if (req.user.isAdmin) {
        try {
            const movies = await Movie.find();
            if (movies.length) {
                res.status(200).json({
                    message: "Movies found",
                    status: true,
                    data: movies.reverse()
                });
                return
            }
            res.status(200).json({
                message: "Movies not found",
                status: true,
                data: {}
            });
        } catch (err) {
            res.status(20).json({
                message: "Movies not found",
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

module.exports = router;