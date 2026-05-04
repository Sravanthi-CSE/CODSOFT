const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const projectRoutes = require("./routes/projectRoutes");

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/projectmanager")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get("/", (req,res)=>{

    res.send("Project Management API Running");

});

/* ROUTES */

app.use("/api/projects",projectRoutes);

app.listen(5000,()=>{

    console.log("Server running on port 5000");

});