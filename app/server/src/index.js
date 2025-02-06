import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIo } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import companyRoutes from "./routes/company.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import { RedisGet, RedisSet } from './config/redis.js';
import mqttClient from "./config/iot.js";
import Iot from "./models/iot.models.js";
import cron from 'node-cron'
import { contract } from "./config/evm.js";
import { LOCALHOST_URL, DEPLOYED_URL } from "./constants.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

export const io = new SocketIo(server, {
  cors: {
    origin: "*", // Update to specific domain in production
    methods: [LOCALHOST_URL, DEPLOYED_URL],
  },
});

let socketMap = {};

io.on('connection' , (socket)=>{
    console.log(`${socket.id} connected`);
    socket.on('subscribe' , async (iots)=>{
        if(iots) {
          iots.forEach(identifier => { //loop to handle all the identifiers
          socketMap[identifier] = socket.id
          });
        }
        let activities = await RedisGet({key:'activities'});
        io.to(socket.id).emit('activities' , activities);
    })

    socket.on('trade' , async (msg)=>{
        console.log('New Trade:',msg);
        io.emit('trade' , msg);
        let activities = await RedisGet({key:'activities'});
        activities = JSON.parse(activities);
        if(!activities) activities = [];
        console.log(activities)
        activities.push(msg);
        await RedisSet({key:'activities',value:JSON.stringify(activities)});
    })

    socket.on('disconnect', () => {
        Object.keys(socketMap).forEach(identifier => {
            if(socketMap[identifier] === socket.id){ 
              console.log(socket[identifier])
              delete socketMap[identifier];
            }
        });
    });
})

export async function BroadcastData(data) {
    if(!socketMap[data.identifier]) return;
    io.to(socketMap[data.identifier]).emit('data' , data);
}

let iotsData = {};

mqttClient.on('connect', ()=>{
  console.log('Connected to MQTT broker');
  mqttClient.subscribe(`iots/+/data`, (error)=>{
    if(!error) console.log(`Subscribed`);
    else console.error(`Subscription error:`, error);
  });
});

mqttClient.on('error', (error)=>{
  console.error(`MQTT Connection Error:${error}`);
});

mqttClient.on('message', (topic, message)=>{
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
    try {
      const data = JSON.parse(message.toString());
      console.log('Processing incoming data:', data);
      // if(data.carbonCredits !== undefined || data.identifier !== undefined) throw new Error('Insufficient Data');
      console.log('Updated latest data:', data);
      iotsData[topic] = JSON.stringify(data);
      BroadcastData(data); 
    } catch (error){
      console.error(`Failed to process incoming data:${error}`);
    }
});

cron.schedule("0 0 * * *" , async ()=>{
iotsData.forEach(data => {
  PublishData(JSON.parse(data));
});
await RedisSet({key:'activities' , value:JSON.parse([])});
},{timezone:"UTC"})


async function PublishData(data) {
  try {
    // publish to the immutable ledger
    const tx = await contract.updateCredits(data.carbonCredits ,  data.identifier);
    const receipt = await tx.wait();
    console.log('receipt:',receipt);

    //add to the centralized database
    const iot = await Iot.findOne({identifier:data.identifier});
    const newCC = iot.carbonCredits.push(data.carbonCredits);
    await Iot.replaceOne({identifier:data.identifier},
      {
        identifier:data.identifier,
        carbonCredits:newCC
      }
    )
  } catch (error) {
    console.log('Some error occured while publishing the data')
  }
}


// Middleware
app.use(
  cors({
    origin: [LOCALHOST_URL , DEPLOYED_URL], // Update to specific domain in production
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.get('/ping',(req,res)=>{
  return res.status(200).send('PONG');
})

// Connect to DB and start the server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(process.env.PORT || 3000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("MONGO db connection failed!!!", err);
  }
};

startServer();
