import mqttClient from "../config/iot.js";
import {BroadcastData} from '../index.js'
import Iot from "../models/iot.models.js";
import { contract } from "../config/evm.js";
import cron from 'node-cron'
import { RedisSet } from "../config/redis.js";

let iotsData = {};

mqttClient.on('connect', ()=>{
    console.log('Connected to MQTT broker');
    mqttClient.subscribe(`iots/+/data`, (error)=>{
      if(!err) console.log(`Subscribed`);
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
        if(data.carbonCredits !== undefined || data.identifier !== undefined) throw new Error('Insufficient Data');
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

