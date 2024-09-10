const express = require("express");
const { authmiddleware } = require("../middleware");
const {Account} = require("../userModels")
const router = express.Router();
const zod = require("zod")

router.get("/balance", authmiddleware, async(req, res)=>{
    const account = await Account.findOne({
        userId: req.userId
    })

    res.json({
        balance: account.balance
    })
})


router.post("/transfer", async(req, res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();

    const {amount, to} = req.body

    const account = await Account.findOne({userId: req.body.userId}).session(session);

    if(!account|| account.balance<amount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "insufficient balance"
        })
    }

    const toAccount = await Account.findOne({userId: to}).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.statu(400).json({
            message: "invalid user"
        })
    }

await Account.updateOne({userId: req.body.userId},{$inc: {balance: -amount} }).session(session);
await Account.updateOne({userId: to}, {$inc: {balance: amount} }).session(session);

await session.commitTransaction();

res.json({
    message: "Transaction successful"
})

})

module.exports = router