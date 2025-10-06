import {ErrorHandler} from "../errorHandling/error.js";
import { reservation } from "../models/reservationSchema.js";

export const sendReservation = async (req,res,next) => {
    const {firstName,lastName,email,phone,time,date} = req.body;//mtlb mujhe ye sab frontend me se chaiye
    if(firstName|| lastName || email ||phone ||time || date){
        //status 400 = bad request
        return next(new ErrorHandler("Please full reservation form",400));
    }
    try {
        await reservation.create(firstName,lastName,email,phone,time,date);
        res.status(200).json({
            success:true,
            message:"Reservation sent successfully",
        })
    } catch (error) {
        if(error.name==="ValidationError"){
            const ValidationErrors = Object.values(error.errors).map(
                (err)=> err.message
            );
            return next(new ErrorHandler(ValidationErrors.join(','),400));
        }
        return next(error);
    }
}