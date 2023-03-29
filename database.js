import mongoose from 'mongoose'

const dbConnect = () => {
    const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/eCashPlay"
    mongoose.connect(DB_URI, {
        dbName: "eCashPlay",
        
    },(err, res)=>{
        if(!err){
            console.log("Successful connection to database")
        }else{
            console.log("Incorrect connection to database")
        }
    }
    )
}

export default dbConnect