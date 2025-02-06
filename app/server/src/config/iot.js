import mqtt from 'mqtt'
import keys from './env.js';

const mqttOptions = {
    host:keys.MQTT_BROKER_HOSTNAME,
    port:keys.MQTT_BROKER_PORT,
    protocol:'mqtts',
    username:keys.MQTT_BROKER_USERNAME,
    password:keys.MQTT_BROKER_PASSWORD,
    rejectedUnauthorized:true
}
const mqttClient = mqtt.connect(mqttOptions);

export default mqttClient;