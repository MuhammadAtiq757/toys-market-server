const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ytvhn6h.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

const addingCollection = client.db('toyZone').collection('addings');

app.get('/alltoy', async(req, res)=>{
  const cursor = addingCollection.find();
  const result = await cursor.toArray();
  res.send(result)
})


app.get('/myToy', async(req, res)=>{
console.log(req.query.email);
let query ={}
if(req.query?.email){
  query = {email: req.query.email}
}
const result = await addingCollection.find(query).toArray();
res.send(result);
})


app.get('/toyDetails/:id', async(req, res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)};
  const result = await addingCollection.findOne(query);
  res.send(result);
})


app.post('/addToy', async(req, res) => {
  const adding = req.body;
  const result = await addingCollection.insertOne(adding)
  res.send(result)
  // console.log(adding);
})

app.delete('/addToy/:id', async (req, res) =>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await addingCollection.deleteOne(query);
  res.send(result)
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res) =>{
    res.send('Toys server is running')
})

app.listen(port, () =>{
    console.log(`Toys server is Running on port ${port}`);
})