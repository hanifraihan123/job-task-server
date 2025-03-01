const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.neb49.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Middleware
app.use(express.json());
app.use(cors());

async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");

      const userCollection = client.db("job-task").collection("users");
      const taskCollection = client.db("job-task").collection("tasks");

        // Perform the bulkWrite operation
    app.post('/add-user', async(req,res)=>{
        const user = req.body;
        const query = {email: user.email}
        const alreadyExist = await userCollection.findOne(query)
        if(alreadyExist){return res.status(400).send('Already Exist')}
        const result = await userCollection.insertOne(user);
        res.send(result)
    })

    app.post('/add-task', async(req,res)=>{
        const task = req.body;
        const result = await taskCollection.insertOne(task);
        res.send(result)
    })

    app.get('/tasks', async(req,res)=>{
        const result = await taskCollection.find().toArray();
        res.send(result)
    })

    app.delete('/task/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await taskCollection.deleteOne(query);
        res.send(result)
    })

    app.get('/task/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await taskCollection.findOne(query);
        res.send(result)
    })

    app.patch('/task/:id', async(req,res)=>{
        const id = req.params.id;
        const tasks = req.body
        console.log(tasks)
        const query = {_id: new ObjectId(id)}
        const update = {
            $set: {
                title: tasks.title,
                description: tasks.details,
                category: tasks.category
              }
        }
        const result = await taskCollection.updateOne(query, update);
        res.send(result)
    })

    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send('job task server is running')
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });