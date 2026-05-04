const express = require("express");

const router = express.Router();

const Project = require("../models/Project");

/* GET */

router.get("/", async(req,res)=>{

  const projects = await Project.find();

  res.json(projects);

});

/* POST */

router.post("/", async(req,res)=>{

  const project = new Project(req.body);

  const savedProject = await project.save();

  res.json(savedProject);

});

/* DELETE */

router.delete("/:id", async(req,res)=>{

  await Project.findByIdAndDelete(req.params.id);

  res.json({
    message:"Project Deleted"
  });

});

/* UPDATE */

router.put("/:id", async(req,res)=>{

  const updatedProject =
  await Project.findByIdAndUpdate(

    req.params.id,
    req.body,
    { new:true }

  );

  res.json(updatedProject);

});

module.exports = router;