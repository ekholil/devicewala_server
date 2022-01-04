const express = require('express')
const { MongoClient } = require('mongodb')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
  res.send('This is the server of devicewala')
})
app.listen(port, () => {
  console.log('Server running at port ' + port)
})
const uri = `mongodb+srv://travelist:ClrwXqUly9jwCqsJ@cluster0.odpvs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("devicewala").collection("allproducts");
    const ordersCollection = client.db("devicewala").collection("orders");
    const reviewCollection = client.db("devicewala").collection("review");
    const usersCollection = client.db("devicewala").collection("users");
 



    // find all products
    app.get('/products', async (req, res) => {
      const result = await productCollection.find({}).toArray()
      res.send(result)
    })



    // api for find single product with id
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await productCollection.findOne(query)
      res.send(result)
    })
    // api for find similar product with category
    app.get('/products/:category', async (req, res) => {
      const category = req.params.category
      const query = { category: category }
      const result = await productCollection.find(query).toArray()
      res.send(result)
    })


    // GET API Load all orders
    app.get('/orders', async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    })

    // GET API orders by specific user
    app.get('/ordersData', async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { email: email };
      const cursor = ordersCollection.find(query);
      const result = await cursor.toArray();
      res.json(result)
    })

    // POST API  orders send to database
    app.post('/orders', async (req, res) => {
      const orders = req.body;
      const result = await ordersCollection.insertOne(orders);
      res.json(result);
    });
    // POST API  products send to database
    app.post('/products', async (req, res) => {
      const orders = req.body;
      const result = await productCollection.insertOne(orders);
      res.json(result);
    });

    // DELETE Order  with user
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.send(result)
    })




    //       // PUT API product update 

    app.put('/updateProduct', (req, res) => {
      const { id, name, price, description, img } = req.body;
      console.log(req.body);
      productsCollection.findOneAndUpdate(
        { _id: ObjectId(id) },
        {
          $set: { name, price, description, img },
        }
      ).then(result => res.send(result.lastErrorObject.updatedExisting))
    })


    // POST API  review send to database
    app.post('/review', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    // GET API Load all review
    app.get('/review', async (req, res) => {
      const cursor = reviewCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
    })



    // GET API specific user email
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      };
      res.json({ admin: isAdmin });

    });


    // POST API users
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log('new user added successfully', user);
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    // PUT API users
    app.put('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const filter = { email: user.email }
      const options = { upsert: true };
      const updateDoc = { $set: user }
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    // PUT API users admin
    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      console.log(result, 'admin created successfully');
      res.json(result);
    })

    // PUT API status update 
    app.put('/updateOrderStatus', (req, res) => {
      const { id, status } = req.body;
      console.log(req.body);
      ordersCollection.findOneAndUpdate(
        { _id: ObjectId(id) },
        {
          $set: { status },
        }
      ).then(result => res.send(result.lastErrorObject.updatedExisting))
    })

  } finally {

  }
}
run().catch(console.dir);
