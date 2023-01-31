const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userdata").catch(err => console.log(err));

const myschema = new mongoose.Schema({
    full_name:{
        type:String,
        minlength:[3,"full name minimum length is 3"],
        trim: true,
        required:true
    },
    email:{
        type:String,
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"email is invalid"],
        trim: true,
        required:true,
        unique: true
    },
    mobile:{
        type: Number,
        trim: true,
        min: [6000000000,"mobile number invalid"],
        max: [9999999999,"mobile number invalid"],
        required: true
    },
    password:{
        type: String,
        minlength: [6,"password minimum length is 6"],
        required: true
    },
    date:{
        type:Date,
        default: Date.now
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

myschema.methods.genToken = async function(){
    try{
        const token = await jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        return token;
    }catch(err){
        return err;
    }
}

const usersCollection = new mongoose.model("users",myschema);
module.exports = usersCollection;