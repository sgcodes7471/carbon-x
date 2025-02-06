import dotenv from 'dotenv'
dotenv.config();

const keys = {
  PORT: process.env.PORT,
  URL: process.env.URL,

  PINATA_API_KEY: process.env.PINATA_API_KEY,
  PINATA_SECRET_API_KEY: process.env.PINATA_SECRET_API_KEY,
  GATEWAY_URL: process.env.GATEWAY_URL,
  PINATA_JWT: process.env.PINATA_JWT,

  MQTT_BROKER_HOSTNAME: process.env.MQTT_BROKER_HOSTNAME,
  MQTT_BROKER_PORT: process.env.MQTT_BROKER_PORT,
  MQTT_BROKER_USERNAME: process.env.MQTT_BROKER_USERNAME,
  MQTT_BROKER_PASSWORD: process.env.MQTT_BROKER_PASSWORD,

  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  MONGODB_URI: process.env.MONGODB_URI,

  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,

  REDIS_HOST : process.env.REDIS_HOST,
  REDIS_PORT : process.env.REDIS_PORT,
  REDIS_PASSWORD : process.env.REDIS_PASSWORD,
  
  RPC_URL : process.env.RPC_URL,
  PRIVATE_KEY : process.env.PRIVATE_KEY,
};


export default keys;