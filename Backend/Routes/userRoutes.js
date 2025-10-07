import express from "express"
import User from "../Modules/User.js"

const router = express.router()

router.post("/register", async(req,res) => {

    try{
        const{name, email, password, phone} = req.body

        const exisiting = await User.findOne({emai});
        if(existing) return res.status(400).json({message: "User Already exists"})

        const newU = new User({name, email, password, phone});
        await User.save();

        res.status(201).json({message:"Registered successfully!", user: newU})
    }

    catch(error){
        res.status(500).json({message:"Error", error});
    }
})


router.post("/login", async(req,res) => {

    const {email, password} = req.body;

    try{
    const user = await User.findOne({email})

    if(!user || user.password != password){
        res.status(400).json({message: "Invalid login"})
    }

    res.json({message: "Login Successful!", user})
    }

    catch(error){
        res.status(500).json({message:"Error",error});
    }
})

export default router;