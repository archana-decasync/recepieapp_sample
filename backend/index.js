//1.importing
const express = require('express');
const imageModel = require('./model');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

//2.initialization
const app = express();

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//3.Api creation
app.get('/', async (req, res) => {
    res.send("success!!!!");
});

app.get('/trial', (req, res) => {
    res.send("trial api is working");
});

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

//post for saving datas into database

app.post('/upload-images', upload.array('images', 10), async (req, res) => {  // Change to 'array'
    try {
        const { title, description, category } = req.body;
        const imageFiles = req.files;  // Get the array of uploaded files

        // Store each image and its related data
        const imagesData = imageFiles.map(file => ({
            title: title,
            description: description,
            image: file.filename,
            category: category
        }));

        // Save all images in the database
        const newImages = await imageModel.insertMany(imagesData);

        res.json({
            status: "ok",
            data: newImages.map(image => ({
                _id: image._id,
                title: image.title,
                description: image.description,
                imageURL: `http://localhost:5000/uploads/${image.image}`,
                category: image.category
            }))
        });
    } catch (error) {
        console.error("Error uploading images:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
});
  


// POST API to create a new entry
app.post('/create', async (req, res) => {
    var result = await new imageModel(req.body);
    result.save();
    res.send("data is added!!!");
});

// GET API to view data with image URLs
app.get('/view', async (req, res) => {
  try {
      // Fetch data from the database
      const data = await imageModel.find();

      // Update data to include full image URLs
      const updatedData = data.map(item => ({
          ...item._doc,
          imageURL: `${req.protocol}://${req.get('host')}/uploads/${item.image}`
      }));

      // Log the updated data with image URLs
      console.log("Retrieved data with image URLs:", updatedData);

      // Send the updated data as a JSON response
      res.json(updatedData);
  } catch (err) {
      console.error("Error retrieving data:", err);
      res.status(500).json({ status: "error", message: err.message });
  }
});

// DELETE API to delete an entry
app.delete('/delete/:id', async (req, res) => {
    console.log(req.params);
    let id = req.params.id;
    await imageModel.findByIdAndDelete(id);
    res.json({ status: "deleted" });
});

// PUT API to update an entry
app.put('/edit/:id', async (req, res) => {
    let id = req.params.id;
    try {
        var data = await imageModel.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ status: "updated", data: data });
    } catch (err) {
        res.status(500).send(err);
    }
});
// Route to get items by category
app.get('/items/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const items = await imageModel.find({ category });
      res.json({ status: 'ok', data: items });
    } catch (error) {
      console.error("Error fetching items by category:", error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });
  

//4.port
app.listen(5000, () => {
    console.log("port 5000 is up and running");
});
