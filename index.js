const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.rkpusfk.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    //Users code start from here:
    const database = client.db('grassroot_db')
    const items = database.collection('items')

    /* ITEMS START */
    //items >> Read
    app.get('/items', async (req, res) => {
      const result = await items.find().sort({food_category: 1}).toArray()
      res.send(result)
    })

    //items/_id >> Read one
    app.get('/items/:id', async (req, res) => {
      const id = req.params.id

      const filter = { _id: new ObjectId(id) }
      const result = await items.findOne(filter)
      res.send(result)
    })

    //item/_id >> Update
    app.put('/items/:id', async (req, res) => {
      const id = req.params.id
      const item = req.body

      const filter = { _id: new ObjectId(id) }
      const updateItem = {
        $set: {
          food_name: item.food_name, 
          food_category: item.food_category, 
          ingredients: item.ingredients, 
          price: item.price, 
          food_image: item.food_image
        }
      }
      const result = await items.updateOne(filter, updateItem)
      res.send(result)
    })

    //items >> Create
    app.post('/items', async (req, res) => {
      const item = req.body

      const result = await items.insertOne(item)
      res.send(result)
    })

    
    /* ITEMS END */

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Welcome to express-server')
})

app.listen(port, () => {
  console.log(`express-server is running on ${port}`)
})