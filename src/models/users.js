const mongoose= require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true
      },
      active: {
        type: Boolean,
        default:true,
      },
      role: {
        type: String,
        default:"user",
      },
      phone:{
          type: String,
          required: false
      },
      chatId:{
        type: Number,
        required: true
      },
      orderCount:{
        type: Number,
        default: 0
      },
      date:{
        type: String,
        default: null
      }
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );
  
  UserSchema.plugin(mongoosePaginate);
  
  const userModel = mongoose.model("users", UserSchema);
  module.exports = userModel;