import mongoose from "mongoose";



const connection = {};

// Get BSON parser class
const BSON = require('bson-ext')

async function connect() {
    console.log('making attempts to connect');
    console.log("MONGO_DB_URI: "+process.env.MONGODB_URI);
    console.log('Connection: '+ connection.isConnected);
    if (connection.isConnected) {
        console.log('already connected');
        return;
    }
    if(mongoose.connections.length > 0) {
        connection.isConnected = mongoose.connections[0].readyState;
        if(connection.isConnected === 1){
            console.log('use previous connection');
            return;
        }
        await mongoose.disconnect();
    }
    
    const db = await mongoose.connect(process.env.MONGODB_URI, {
    //const db = await mongoose.connect("mongodb://localhost:27017/test", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log('New connection');
    connection.isConnected = db.connections[0].readyState;
    console.log('Connection: '+ connection.isConnected);
}

async function disconnect() {
    console.log('in Disconnect method, Connection: '+ connection.isConnected);
    if(connection.isConnected) {
        console.log("NODE_ENV:"+process.env.NODE_ENV);
        console.log('Connection exists. Now disconnect');
        if(process.env.NODE_ENV === 'production') {
            await mongoose.disconnect();
            connection.isConnected = false;
            console.log('Disconnected');
        } else {
            console.log('not disconnected');
        }
    }
}

function convertMasalaRecipeDocToObj(doc) {
    const newDoc = {};
    newDoc.name = doc.name;
    newDoc.slug = doc.slug;
    newDoc.category = doc.category;
    newDoc.image = doc.image;
    newDoc.description = doc.description;
    newDoc.ingredients = doc.ingredients.map(serializeObj);
    return newDoc;
}

function serializeObj(item) {
    const newItem = {};
    newItem.name = item.name;
    newItem.amount = item.amount;
    newItem.unit = item.unit;
    newItem.description = item.description;
    return newItem;
}


function convertProductDocToObj(doc) {
    doc._id = doc._id.toString();
    doc.createdAt = doc.createdAt.toString();
    doc.updatedAt = doc.updatedAt.toString();  
    return doc;
}


const db = {connect, disconnect, convertProductDocToObj, convertMasalaRecipeDocToObj};

export default db;