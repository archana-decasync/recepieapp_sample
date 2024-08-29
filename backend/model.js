const mongoose =require("mongoose");

mongoose.connect("mongodb+srv://qvillo:qvillo@cluster0.dshclpc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("db connected")
})
.catch(err=>console.log(err))

let Schema = mongoose.Schema;

const recepieSchema = new Schema({
    title: String,            
    description: String,      
    image: {
      data: Buffer,           
      contentType: String 
    }
});
var recepieModel = mongoose.model("users",recepieSchema);
module.exports = recepieModel;