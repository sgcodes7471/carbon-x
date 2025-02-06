import mongoose from "mongoose";

const iotSchema = new mongoose.Schema(
  {
    identifier : {type:String , required:true},
    carbonCredits : [{type:Number,default:0}]
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Iot = mongoose.model("Iot", iotSchema);

export default Iot;
