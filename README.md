
# CarbonX
#### About CarbonX

#### To read all the documentations and work flow refer to the ['docs'](https://github.com/Aardy-Bond/Kriti-25/tree/main/docs) directory

## 💻 TechStack Used
#### <ul><li>JavaScript</li><li>Solidity</li><li>Circom</li><li>ReactJS</li><li>TailwindCSS</li><li>NodeJS</li><li>Web3.js</li><li>MongoDB</li><li>IPFS</li><li>PinataSDK</li><li>GraphQL</li><li>SocketIO</li><li>ZK Snarks</li><li>Redis</li></ul>


## 🚀 Features


## ⚙️ Setting up the Project locally
### Prerequisites
#### Node.js should be installed on your system
#### An account on IPFS and PinataSDK
#### Either MongoDB should be available on your local or make a account in MongoAtlas to use it without dowloading
#### Account on Cloudinary for saving uploaded files
#### Should have a crypto wallet(like Metamask) with some sepolia in it
#### An ESP32 microcontroller setup connected to a computer for running the Arduino code
#### An Account in the HiveMQ-A MQTT Broker Cloud
#### Arduino IDE installed on the computer with which the ESP32 microcontroller will be connected using MicroUSB cable
#### A free account on Redis Cloud
#### <ul><li>[Node.js](https://nodejs.org/en/)</li><li>[MetaMask extension](https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm)</li><li>[MongoDB(local)](https://www.mongodb.com/docs/manual/installation/)</li><li>[MongoAtlas(Cloud)](https://www.youtube.com/watch?v=VkXvVOb99g0)</li><li>[IPFS](https://merrillinsurance.ipfs.com/)</li><li>[PinataSDK](https://pinata.cloud/)</li><li>[HiveMQ](https://www.hivemq.com/mqtt/public-mqtt-broker/)</li><li>[Cloudinary](https://cloudinary.com/users/login)</li></ul>

### Setting up the frontend
```
cd app/client
npm install
```
### Setting up the backend
```
cd app/server
npm install
```

### 🎪 Setting up .env Variables

#### First we need to configure a .env file for secret variables used in the sever side of this project

#### You need to add following variables in your .env file in the server folder:
```
PORT= " the port where your server-side express application will run"
URL= "URL of the client side website"

PINATA_API_KEY= " received from the official website of Pinata "
PINATA_SECRET_API_KEY= " received from the official website of Pinata "
GATEWAY_URL= " received from the official website of Pinata "
PINATA_JWT= " received from the official website of Pinata "

MQTT_BROKER_HOSTNAME= " received from the official website of HiveMQ "
MQTT_BROKER_PORT= " received from the official website of HiveMQ "
MQTT_BROKER_USERNAME= " received from the official website of HiveMQ "
MQTT_BROKER_PASSWORD= " received from the official website of HiveMQ "

EMAIL_ADDRESS= "a outlook email address for sending emails"
EMAIL_PASSWORD= "password of that account"

MONGODB_URI= " URL of the cloud database setup on MongoAtlas "

api_secret= " credentials of cloudinary "
api_key= " credentials of cloudinary "
cloud_name= " credentials of cloudinary "

REDIS_HOST = "get from redis cloud" ,
REDIS_PORT = "get from redis cloud" ,
REDIS_PASSWORD = "get from redis cloud",
```
### Starting the project locally
#### in app/client, below starts the client-side React+Vite application
```
npm run build
npm run prod
```
#### in app/server, below starts the server-side Node+Express application
```
npm run dev
```

## 📂 Directory Structure
```
├── README.md                   <- Project overview and instructions
├── .gitignore                  <- Files/folders not pushed on github

├──arduino-code                 <- Code to be run on ESP32 microcontroller
    └── code.h

├── docs                        <- Documentation and project demo
│   └── demo.mp4                <- Walk-through video, covering setup, UI, and functionality
│   └── apis                    <- Includes the API defination and practices followed in the application
│   └── architecture            <- Includes the entire system architecture and implementations
│   └── contracts               <- Includes the solidity contracts and thier outline
│       └── main.sol            <- Solidity Contract for NFT-minting and listing credits
│       └── iot.sol             <- Includes the solidity contracts and thier outline
│   └── ui                      <- Glimpses of UI and their outline
│   └── zksnarks                <- Implementation of ZK Snarks along with all the necessary files
│       └── purchase            <- Includes the files generated for ZK Proof for Buy-side
│       └── sell                <- Includes the files generated for ZK Proof for Sell-side

├── listing                     <- Auto generated folder for building and deploying the subgraphs. Consists the schema and events   

├── app                         <- Main directory consisting of the source code of the application
│   └── AdminDashboard          <- Consists the UI made on ReactJS of the admin dashboard used to verify the documents of the businesses before their onchain onboarding 
│   └── client                  <- Consists the source-code for the main UI interface of the application
│       └── src    
│           └── apis
│           └── assests
│           └── components
│           └── configs
│           └── context
│           └── graphql
│           └── page
│           └── styles   
│           └── App.jsx    
│           └── index.css    
│           └── main.jsx   
│   └── server                  <- Consists the source-code for the server side application, following a monolithic standard of Models-Controllers-Routes with Express Framework
│       └── public              <- Includes the static files required for ZK proof generation in the client side
│       └── uploads             <- Temporarily stores the files/docs uploaded for verification
│       └── src                 
│           └── config      
│           └── controllers               
│           └── db      
│           └── middlewares           
│           └── models           
│           └── routes         
│           └── services            
│           └── utils                 
│           └── constants.js         
│           └── index.js        <- Start point of server-side application        
```


## 🐛 Bug Reporting
#### Feel free to [open an issue](https://github.com/) on GitHub if you find any bug.

<br />

## ⭐ Feature Suggestion
#### Feel free to [open an issue](https://github.com/) on GitHub if you have feature idea to be added 🙌.

<!-- ## 🧩 Team
#### <ul><li>[Srinjoy](https://github.com/)</li><li>[Kevin](https://github.com/)</li><li>[Yash](https://github.com/)</li><li>[Shreyansh](https://github.com/)</li><li>[Dev](https://github.com/)</li><li>[Ayushmann](https://github.com/)</li></ul> -->


Thanks for visiting my repository 😊!! Please give a star ⭐ if you liked our project.
