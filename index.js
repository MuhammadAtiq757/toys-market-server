const express = require('express');
const cors = require('cors');


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
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
     client.connect();

const addingCollection = client.db('toyZone').collection('addings');


// const indexKeys = { name: 1 }; 
// const indexOptions = { name: "name" }; 
// const results = await addingCollection.createIndex(indexKeys, indexOptions);

// console.log(result);


app.get("/findName/:text", async (req, res) => {
  const text = req.params.text;
  const result = await addingCollection
    .find({
      $or: [
        { name: { $regex: text, $options: "i" } },
       
      ],
    })
    .toArray();
  res.send(result);
});




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
console.log(result)
res.send(result);
})

app.get('/toyCategory/:category', async (req, res)=>{
  const id = req.params.category;
  const toys = await addingCollection.find({category: id}).limit(3).toArray()
  res.send(toys)
})










app.put('/updateToy/:id', async(req, res)=>{
  const id = req.params.id;
  const body = req.body;
  const query = {_id: new ObjectId(id)};
  const option = {upsert: true};
  const updateToy={
    $set:{
      price: body.price,
      quantity: body.quantity,
      detail: body.detail,
    },
  };
  const result = await addingCollection.updateOne(query, updateToy, option);
  res.send(result)
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
    // await client.db("admin").command({ ping: 1 });
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