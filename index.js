const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// DB_USER: geniusCar
// DB_PASSWORD:  OIR6aK8qLSASg4S2
console.log(process.env.DB_USER);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mzq8zh6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        // we have create two collections services and orders
        const userCollection = client.db("GeniusCars").collection("Services");
        const orderCollection = client.db("GeniusCars").collection("Orders");
        // sob data load kora hoyeche get diye
        app.get("/services", async (req, res) => {
            const query = {};
            const curser = userCollection.find(query);
            const services = await curser.toArray();
            res.send(services);
        });

        //only id diye ekta data load kora hoyeche
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        app.post("/orders", async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        app.get("/orders", async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email,
                };
            }
            const curser = orderCollection.find(query);
            const orders = await curser.toArray();
            res.send(orders);
        });
    } finally {
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
