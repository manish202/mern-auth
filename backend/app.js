require("dotenv").config();
const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usersCollection = require("./db_conn");
const app = express();
var cors = require("cors");
app.use(express.json());
app.use(cors());
app.get("/",(req,res) => {
    res.send({message:"nothing anything is here",status:false});
});
app.post("/auth",async (req,res) => {
    if(req.body.jwt !== undefined){
        try{
            const verify = await jwt.verify(req.body.jwt,process.env.SECRET_KEY);
            let userdata = await usersCollection.findById(verify._id);
            let {full_name,email,mobile,date} = userdata;
            res.send({full_name,email,mobile,date});
        }catch(error){
            res.send({message:"invalid token",status:false});
        }
    }else{
        res.send({message:"invalid request",status:false});
    }
});
app.post("/registeruser",async (req,res) => {
    let {full_name,email,mobile,password} = req.body;
    if(full_name && email && mobile && password){
        try{
            let emailExists = await usersCollection.findOne({email:email});
            if(emailExists){
                res.send({message:"email is already registered",status:false});
            }else{
                password = await bcryptjs.hash(password,10);
                let dbrespo = await new usersCollection({full_name,email,mobile,password});
                let token = await dbrespo.genToken();
                dbrespo.save();
                res.send({full_name,email,mobile,date:dbrespo.date,token});
            }
        }catch(error){
            res.send({message:error.message,status:false});
        }
    }else{
        res.send({message:"something is missing",status:false});
    }
});
app.post("/loginuser",async (req,res) => {
    let {email,password} = req.body;
    if(email && password){
        try{
            let dbrespo = await usersCollection.findOne({email:email});
            if(dbrespo){
                let match = await bcryptjs.compare(password,dbrespo.password);
                if(match){
                    let {full_name,email,mobile,date} = dbrespo;
                    let token = await dbrespo.genToken();
                    dbrespo.save();
                    res.send({full_name,email,mobile,date,token});
                }else{
                    res.send({message:"password not matched.",status:false});
                }
            }else{
                res.send({message:"email is not registered.",status:false});
            }
        }catch(error){
            console.log(error);
            res.send({message:error.message,status:false});
        }
    }else{
        res.send({message:"email or password is missing",status:false});
    }
});
app.listen(8000);