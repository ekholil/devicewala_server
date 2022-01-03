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
     
     
      
     // find all products
      app.get('/products', async(req, res) => {
        const result = await productCollection.find({}).toArray()
        res.send(result) 
      })
      
       // //post api for save user in db
       app.post('/users', async(req, res) => {
        const data = req.body;
        const result = await usersCollection.insertOne(data)
        res.send(result)
        console.log(result)
      })
      app.put('/users', async(req, res) => {
        const user = req.body;
        const filter = {email : user.email}
        const options = {upsert: true}
        const updatedDoc = {$set: user}
        const result = await usersCollection.updateOne(filter, updatedDoc, options)
        res.json(result)
      })
    //   //find all orders
    //   app.get('/orders', async(req, res) => {
    //     const result = await ordersCollection.find({}).toArray()
    //     res.send(result) 
    //   })
    //   //find all reviews
    //   app.get('/review', async(req, res) => {
    //     const result = await reviewCollection.find({}).toArray()
    //     res.send(result) 
    //   })

    // api for find single product with id
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await productCollection.findOne(query)
      res.send(result)
    })

    //   // //post api
    //   app.post('/addproduct', async(req, res) => {
    //     const data = req.body;
    //     const result = await cycleCollection.insertOne(data)
    //     res.json(result)
    //   })
    //   // //post api for buy now
    //   app.post('/orders', async(req, res) => {
    //     const data = req.body;
    //     const result = await ordersCollection.insertOne(data)
    //     res.send(result)
    //     console.log(result)
    //   })
    //   // //post api for review
    //   app.post('/review', async(req, res) => {
    //     const data = req.body;
    //     const result = await reviewCollection.insertOne(data)
    //     res.send(result)
    //     console.log(result)
    //   })
    // check admin
    //   app.get('/users/:email', async(req, res) => {
    //     const email = req.params.email;
    //     const query = {email: email}
    //     const user = await usersCollection.findOne(query)
    //     let isAdmin = false
    //     if(user?.role === 'admin'){
    //       isAdmin = true;
    //     }
    //     res.json({admin: isAdmin})
    //   })

    //   // make admin api 
    //   app.put('/users/admin', async(req, res) => {
    //     const user = req.body;
    //     const filter = {email : user.email}
    //     const updateDoc = {$set : {role: 'admin'}}
    //     const result = await usersCollection.updateOne(filter, updateDoc)
    //     res.json(result)
    //   })
    //   // // api for find orders by email
    //   app.get('/myorders/:email', async(req, res) => {
    //     const email = req.params.email;
    //     const query = {email : email}
    //     const result = await ordersCollection.find(query).toArray()
    //     res.send(result)
    //   })

    //   // //delete api
    //   app.delete('/cancelorder/:id', async(req, res) => {
    //     const id = req.params.id;
    //     const query = {_id : ObjectId(id)}
    //     const result = await ordersCollection.deleteOne(query)
    //     res.json(result)
    //   })
    //   // //delete api from manage order
    //   app.delete('/deleteorder/:id', async(req, res) => {
    //     const id = req.params.id;
    //     const query = {_id : ObjectId(id)}
    //     const result = await ordersCollection.deleteOne(query)
    //     res.json(result)
    //   })
    //   // //delete api from manage products
    //   app.delete('/products/:id', async(req, res) => {
    //     const id = req.params.id;
    //     const query = {_id : ObjectId(id)}
    //     const result = await cycleCollection.deleteOne(query)
    //     console.log(result)
    //     res.json(result)
    //   })
    //   // // update
    //   app.put('/updatestatus/:id', async(req, res) => {
    //     const id = req.params.id;
    //     const item = req.body;
    //     const filter = {_id : ObjectId(id)}
    //     const options = { upsert: true };
    //     // create a document that sets the plot of the movie
    //     const updateDoc = {
    //       $set: {
    //         status: item.status,
    //       },
    //     };
    //     const result = await ordersCollection.updateOne(filter, updateDoc, options)
    //     console.log('upadating user ', id)
    //     res.send(result)

    //   })

  } finally {

  }
}
run().catch(console.dir);
