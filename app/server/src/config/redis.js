import { createClient } from 'redis';
import keys from './env.js';

let redisClient;

(async () => {
    try {
      redisClient = createClient({
        username: 'default',
        password: keys.REDIS_PASSWORD,
        socket: {
            host: keys.REDIS_HOST,
            port: keys.REDIS_PORT
        }
    });
      redisClient.on("error", (error) => console.error(`Error in connecting to Redis:\n${error}`));
      console.log('Redis running on a cloud')
      await redisClient.connect();
    } catch (error) {
      console.log(error)
      console.log('Some Error Occured in Redis')
    }
  })();
  
  export async function RedisSet({key , value , ex}) {
    if(!ex) await redisClient.set(key , value)
    else await redisClient.set(key , value , {EX:ex*60 , NX:true})
  }
  
  export async function RedisGet ({key}){
    const value = redisClient.get(key)
    return value
  }