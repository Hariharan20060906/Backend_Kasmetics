const express=require("express");
const mongoose = require("mongoose");
const cors=require("cors");
const app = require('./app');
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(err => {
    console.log("MongoDB connection failed:", err.message);
  });
app.listen(6000,()=>{
    console.log("Server running on port 6000");
})