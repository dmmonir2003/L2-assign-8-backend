const express = require('express');
const cors = require('cors');

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db('PHL2assignment9');
        const productsCollection = db.collection('products');



        // ==============================================================
        // WRITE YOUR CODE HERE


        // GET all products
        app.get('/api/products', async (req, res) => {
            try {
                const products = await productsCollection.find({}).toArray();
                res.json(products);
            } catch (error) {
                console.error("Error fetching products:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });

        // GET a single product by ID
        app.get('/api/products/:productId', async (req, res) => {

            const productId = req.params.productId;
            console.log(productId);
            const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
            if (!product) {
                res.status(404).json({ error: "Product not found" });
                return;
            }
            res.json(product);

        });

        // POST a new product
        app.post('/api/products', async (req, res) => {
            try {
                const newProduct = req.body;
                const result = await productsCollection.insertOne(newProduct);
                res.json(result);
            } catch (error) {
                console.error("Error adding product:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });


        // GET products by category
        app.get('/api/products/category/:category', async (req, res) => {
            try {
                const category = req.params.category;
                const products = await productsCollection.find({ category }).toArray();
                res.json(products);
            } catch (error) {
                console.error("Error fetching products by category:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });














        // ==============================================================


        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    } finally {
    }
}

run().catch(console.dir);

// Test route
app.get('/', (req, res) => {
    const serverStatus = {
        message: 'Server is running smoothly',
        timestamp: new Date()
    };
    res.json(serverStatus);
});