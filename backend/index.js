//1.importing
const express = require('express');
const imageModel = require('./model')
const cors = require('cors');
//2.initialization
const app = new express();



//middleware

app.use(express.urlencoded({extended:true}));


app.use(express.json());
app.use(cors({origin: true, credentials: true}));



//3.Api creation
//app.get(url,callback)
app.get('/',async (req,res)=>{
    res.send("success!!!!")
})
app.get('/trial',(req,res)=>{
    res.send("trial api is working")
})



const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,"uploads/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null,uniqueSuffix+  file.originalname);
    }
  })
  
  const upload = multer({ storage: storage })
//post api
app.post('/upload-image',upload.single("image"),async(req,res)=>{
    console.log(req.body);
    const {title,description} = req.body;
  const imageName = req.file.filename;

  try {
    await imageModel.create({
      title:title,
      description:description,
      image:imageName
    })
    res.json({status:"ok"})
    
  } catch (error) {
    res.json({status: error})
    
  }
})

app.post('/create',async(req,res)=>{
    var result = await new imageModel(req.body);
    result.save();
    res.send("data is added!!!")
})




app.get('/view', async (req, res) => {
  try {
    const data = await imageModel.find();
    const updatedData = data.map(item => {
      return {
        ...item._doc,
        imageURL: `http://localhost:5000/uploads/${item.image}`
      }
    });
    console.log(updatedData);  // Log the data to verify the URLs
    res.json(updatedData);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));


//delete
app.delete('/delete/:id',async(req,res)=>{
console.log(req.params)
let id = req.params.id;
await imageModel.findByIdAndDelete(id);
res.json({status:"deleted"})
})

//update
app.put('/edit/:id',async(req,res)=>{
    let id = req.params.id
    try{
        var data = await imageModel.findByIdAndUpdate(id,req.body)
        res.json({status:"updated"})
    }
    catch(err){
        res.status(500).send(err)
    }
})


//4.port
app.listen(5000,()=>{
    console.log("port 5000 is up and running")
})