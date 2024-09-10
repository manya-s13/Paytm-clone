const express = require("express")
const {User, Account}  = require("../userModels")
const zod = require("zod");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config")
const {authmiddleware} = require("../middleware")

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
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    })
    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

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

const updatebody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

router.put("/", authmiddleware, async(req, res)=>{
    const {success} = updatebody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message: "error while updating info" 
        })
    }

    await User.updateOne({_id: req.userId}, req.body)

    res.json({
        message: "updated successfully"
    })
})

router.get("/bulk", async (req, res)=>{
    const filter = req.query.filter || " "

    const users = await User.find({
        $or:[{
            firstName:{
                "$regex" : filter
            }
        }, {
            lastName:
            {
                "$regex" : filter
            }
        }]
    })

    res.json({
        user: users.map(user=>({
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;
