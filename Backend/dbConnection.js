import mongoose from "mongoose"

const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "medicationDB"
    }).then(() => {
        console.log("Connect to database successfully")
    }).catch(err=>{
        console.log(`Some error occured during connection ${err}`);
    })
}

export default dbConnection;
