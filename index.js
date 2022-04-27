const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const res = require('express/lib/response');

require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express()

// MiddleWire

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3eaa1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    console.log("running db server");
    try {
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('services');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });


        app.get('/services/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const services = await serviceCollection.findOne(query);

            res.send(services);
        })
        // post 

        app.post('/services', async (req, res) => {

            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })

        // Delete

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await serviceCollection.deleteOne(query);

            res.send(result);
        })

    }

    finally {

    }
}
run().catch(console.dir);








app.get('/', (req, res) => {
    res.send('Running Genius Server');
})


app.listen(port, () => {
    console.log("Listing to port ", port);
})