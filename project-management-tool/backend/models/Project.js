const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({

  title:{
    type:String,
    required:true
  },

  task:{
    type:String
  },

  description:{
    type:String
  },

  deadline:{
    type:String
  },

  priority:{
    type:String,
    default:"Medium"
  },

  status:{
    type:String,
    default:"Pending"
  }

});

module.exports = mongoose.model(
  "Project",
  ProjectSchema
);