import { RedisGet, RedisSet } from '../config/redis.js';
import {io} from '../index.js'

let socketMap = {};

io.on('connection' , (socket)=>{
    console.log(`${socket.id} connected`);
    socket.on('subscribe' , async (iots)=>{
        iots.forEach(identifier => { //loop to handle all the identifiers
            socketMap[identifier] = socket.id
        });
        let activities = await RedisGet({key:'activities'});
        io.to(socket.id).emit('activities' , activities);
    })

    socket.on('trade' , async (msg)=>{
        console.log('New Trade:',msg);
        io.emit('trade' , msg);
        let activities = await RedisGet({key:'activities'});
        activities = JSON.parse(activities);
        activities.push(msg);
        await RedisSet({key:'activities',value:JSON.stringify(activities)});
    })

    socket.on('disconnect', () => {
        Object.keys(socketMap).forEach(identifier => {
            if(socketMap[identifier] === socket.id) delete socketMap[identifier];
        });
    });
})

export async function BroadcastData(data) {
    if(!socketMap[data.identifier]) return;
    io.to(socketMap[data.identifier]).emit('data' , data);
}