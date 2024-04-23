const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'animoLabsDB';
const collectionName = 'seats'; 

const initialSeats = [
    { seat: 'G1', status: 'available' },
    { seat: 'G2', status: 'available' },
    { seat: 'G3', status: 'available' },
    { seat: 'G4', status: 'available' },
    { seat: 'G5', status: 'available' },
    { seat: 'G6', status: 'available' },
    { seat: 'G7', status: 'available' },
    { seat: 'G8', status: 'available' },
    { seat: 'G9', status: 'available' },
    { seat: 'G10', status: 'available' },
    { seat: 'G11', status: 'available' },
    { seat: 'G12', status: 'available' },
    { seat: 'G13', status: 'available' },
    { seat: 'G14', status: 'available' },
    { seat: 'G15', status: 'available' },
    { seat: 'G16', status: 'available' },
    { seat: 'G17', status: 'available' },
    { seat: 'G18', status: 'available' },
    { seat: 'G19', status: 'available' },
    { seat: 'G20', status: 'available' },
    { seat: 'G21', status: 'available' },
    { seat: 'G21', status: 'available' },
    { seat: 'G22', status: 'available' },
    { seat: 'G24', status: 'available' },
    { seat: 'G25', status: 'available' },
    { seat: 'G26', status: 'available' },
    { seat: 'G27', status: 'available' },
    { seat: 'G28', status: 'available' },
    { seat: 'G29', status: 'available' },
    { seat: 'G30', status: 'available' }
];

async function populateSeats() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const existingSeats = await collection.find({}).toArray();
        if (existingSeats.length === 0) {
            await collection.insertMany(initialSeats);
            console.log('Initial seats inserted successfully');
        } else {
            console.log('Seats already exist, skipping population');
        }
    } catch (error) {
        console.error('Error populating seats:', error);
    } finally {
        await client.close();
    }
}

populateSeats();
