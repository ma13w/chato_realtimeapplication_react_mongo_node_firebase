import express from "express";
import mongoose from "mongoose";
import Messages from "./model/dbMessage.mjs"
import cors from "cors"
import Pusher from "pusher";

const pusher = new Pusher({
    appId: "1349799",
    key: "6a0c9f4c275af7263f6d",
    secret: "a10d77868af959da5607",
    cluster: "eu",
    useTLS: true
});

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors())

//DATABASE//
const connectionDbUrl = 
"mongodb+srv://admin:VPOAH5jTmqlb4r2X@cluster0.9liq8.mongodb.net/chatDBretryWrites=true&w=majority";

mongoose.connect(connectionDbUrl,
    {
        // per eventuali problemi togliere ciò
        // useNewUrlParser : true,
        // useUnifiedTopology : true
    },
    (err)=>{
        if(!err) console.log("Mongo funziona");
    }
);

const db = mongoose.connection;

db.once('open', function(){
    console.log('Db Connected')
    const msgCollection = db.collection("messagecontents")
    const changeStream = msgCollection.watch();
    changeStream.on('change', (change)=>{
        console.log(change)
        if(change.operationType === 'insert'){
            const record = change.fullDocument
            pusher.trigger("messages", "insert", {
                'name': record.name,
                'message': record.message
            });
        }else{
            console.log('Not Trigger Pusher')
        }
        
    })
})

app.get('/api', (req,res)=>{
    res.status(200).send("Benvenuto sul server");
})

app.get('/api/v1/messages/sync', (req,res)=>{
    Messages.find((err,data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    })
})

app.post('/api/v1/messages', (req,res)=>{
    const dbMessage = req.body;
    Messages.create(dbMessage, (err,data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    })
})

    

app.listen(port,()=>{
    console.log(`server start on port: ${port}`);
})