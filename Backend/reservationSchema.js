import mongoose from "mongoose"
import validator from "validator";
//we have installed validator for email verification
const reservationSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[3,"first name must contain atleast 3 characters!!!"],
        maxLength:[30,"first name does not exceed 30 characters"]
    },
    lastName:{
        type:String,
        required:true,
        minLength:[3,"last name must contain atleast 3 characters!!!"],
        maxLength:[30,"last name does not exceed 30 characters"]
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail,"Provide a valid email!!!"],
    },
    phone:{
        type:String,
        required:true,
        minLength:[10,"enter valid number"],
        maxLength:[10,"Enter valid number"]
    },
    time:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        required:true,
    },
})

export const reservation = mongoose.model("reservation",reservationSchema);