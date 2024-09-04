const mongoose =require("mongoose");

mongoose.connect("mongodb+srv://qvillo:qvillo@cluster0.dshclpc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("db connected")
})
.catch(err=>console.log(err))

let Schema = mongoose.Schema;

const recepieSchema = new Schema({
  title: {
    type: String,
    required: true,
},
description: {
    type: String,
    required: true,
},
image: {
    type: String, // This stores the image filename or URL
    required: true,
},
category: {
    type: String,
    required: true,
},
});
var recepieModel = mongoose.model("users",recepieSchema);
module.exports = recepieModel;