import express from "express";
import Medication from "../Modules/medication.js";

const router = express.Router();

router.post("/addMed", async(req,res) => {
    try{
        const{userId, name, dosage, frequency, time } = req.body;

        const newMed = new Medication ({
            user : userId,
            name, dosage, frequency, time
        });

        await Medication.save();
        res.status(201).json({message: "New medication Added", medication: newMed})
    }

    catch(error){
        res.status(500).json({message:"Error",error})
    }
} );

export default router;