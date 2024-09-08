const express = require("express")
const {User}  = require("../userModels")
const zod = require("zod");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config")

const router = express.Router();

const signupBody = zod.object({
    userName: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})

router.post("/signup", async (req, res)=>{
    const { success } = signupBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message: "incorrect inputs"
        })
    }

    const existingUser = await User.findOne({userName: req.body.userName})

    if(existingUser){
        return res.status(411).json({
            message: "email already taken"
        })
    }

    const user = await User.create({
        userName: req.body.userName,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastNam,
    })
    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "user created successfully",
        token: token
    })
})

const signinBody = zod.object({
    userName: zod.string().email(),
    password: zod.string()
})

router.post("/signin", async(req, res)=>{
    const {success} = signinBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message: "incorrect inputs"
        })
    }

    const user = await User.findOne({
        userName: req.body.userName,
        password: req.body.password
    })

    if(user){
        const token = jwt.sign({
            userId: userId._id
        }, JWT_SECRET)

        res.json({
            token: token
        })
        return 
    }

    res.status(411).json({
        message: "error while logging in"
    })

})

module.exports = router;
