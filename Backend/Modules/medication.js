import mongoose from "mongoose"

const medSchema = {
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name:{
        type: String,
        required: true
    },

     frequency:{
        type: String,
        required: true
    },

     dosage:{
        type: String,
        required: true
    },

     time:{
        type: String,
        required: true
    }
}

const Med = mongoose.Schema("Med",medSchema)

export default Med;