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
    const shopping_cart = database.collection('cart')
    const placed_orders = database.collection('placed_orders')

    /* ITEMS START */
    //items >> Read
    app.get('/items', async (req, res) => {
      const result = await items.find().sort({ food_category: 1 }).toArray()
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

    //items/_id >> Delete
    app.delete('/items/:id', async (req, res) => {
      const id = req.params.id

      const filter = { _id: new ObjectId(id) }
      const result = await items.deleteOne(filter)
      res.send(result)
    })


    /* ITEMS END */
    /* Cart START */

    //Cart >> Create
    app.post('/cart', async (req, res) => {
      const cart = req.body

      const result = await shopping_cart.insertOne(cart)
      res.send(result)
    })

    //Cart/_id >> Read
    app.get('/cart/:id', async (req, res) => {
      const email = req.params.id

      const filter = { userId: email }
      const result = await shopping_cart.find(filter).toArray()
      res.send(result)
    })
    
    //Cart?_id >> Read query
    app.get('/cart', async (req, res) => {
      const email = req.query.email;
      const filter = { userId: email };
      const result = await shopping_cart.find(filter).toArray();
      res.send(result);
    });

    //Cart/_id >> Delete
    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id

      const filter = { _id: new ObjectId(id) }
      const result = await shopping_cart.deleteOne(filter)
      res.send(result)
    })


    /* Cart END */
    /* ORDERS START */

    //placed_orders >> Create
    app.post('/orders', async (req, res) => {
      const order = req.body

      const result = await placed_orders.insertOne(order)
      res.send(result)
    })

    //placed_orders >> Read
    app.get('/orders', async (req, res) => {
      const result = await placed_orders.find().sort({ _id: -1 }).toArray()
      res.send(result)
    })

    //placed_orders/_id >> Read one
    app.get('/orders/:id', async (req, res) => {
      const id = req.params.id

      const filter = { _id: new ObjectId(id) }
      const result = await placed_orders.findOne(filter)
      res.send(result)
    })

    //placed_orders/_id >> Update
    app.put('/orders/:id', async (req, res) => {
      const id = req.params.id
      const order = req.body

      const filter = { _id: new ObjectId(id) }
      const updateOrder = {
        $set: {
          status: order.status,
        }
      }
      const result = await placed_orders.updateOne(filter, updateOrder)
      res.send(result)
    })

    //placed_orders/_id >> Delete
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id

      const filter = { _id: new ObjectId(id) }
      const result = await placed_orders.deleteOne(filter)
      res.send(result)
    })



    /* ORDERS END */



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