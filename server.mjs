import express from "express" 
import path from 'path';
import cors from 'cors';
import mongoose from"mongoose"




const app = express()
const port = process.env.PORT || 3000
const mongodbURI = process.env.mongodbURI || "mongodb+srv://Huzaifa:mypassword@cluster0.vpuj8pq.mongodb.net/mydatabase?retryWrites=true&w=majority"
mongoose.connect(mongodbURI);
app.use(cors());
app.use(express.json());

// mongoose.set('strictQuery', true);
let products = []; // TODO: connect with mongodb instead

let productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    createdOn: { type: Date, default: Date.now }
});
const myProductModel = mongoose.model('MyProducts', productSchema);

app.post('/product', (req, res) => {
    const body = req.body;
  if ( // validation
      !body.name
      || !body.price
      || !body.description
  ) {
      res.status(400).send({
          message: "required parameters missing",
      });
      return;
  }

  console.log(body)
  console.log(body.name)
  console.log(body.price)
  console.log(body.description)
 
    // products.push({
    //     id: new Date().getTime(),
    //     names: req.body.names,
    //     price: req.body.price,
    //     description: req.body.description

    // });

    myProductModel.create({
        name:body.name,
        price:body.price,
        description:body.description
    },
        (err, saved) => {
            if (!err) {
                console.log(saved);
                res.send({
                    message: "product added successfully"
                });
            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        })

  



})

app.get('/products', (req, res) => {
    res.send({
        message: "got all products successfully",
        data: products
    })
})
app.get('/product/:id', (req, res) => {

    const id = Number(req.params.id);

    let isFound = false;
    for (let i = 0; i < products.length; i++) {

        if (products[i].id === id) {
            res.send({
                message: `get product by id: ${products[i].id} success`,
                data: products[i]
            });

            isFound = true
            break;
        }
    }
    if (isFound === false) {
        res.status(404)
        res.send({
            message: "product not found"
        });
    }
    return;
})

app.delete('/product/:ids', (req, res) => {
    const id = Number(req.params.ids);

    let isFound = false;
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            products.splice(i, 1);
            res.send({
                message: "product deleted successfully",
            });
            isFound = true
            break;
        }
    }
    if (isFound === false) {
        res.status(404)
        res.send({
            message: "delete fail: product not found"
        });
    }
})

app.put('/product/:editId', (req, res) => {

    const body = req.body;
    const id =  Number(req.params.editId);

    if ( // validation
        !body.names
        && !body.price
        && !body.description
    ) {
        res.status(400).send({
            message: "required parameters missing"
        });
        return;
    }

    let isFound = false;
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {

            products[i].names = body.names;
            products[i].price = body.price;
            products[i].description = body.description;

            res.send({
                message: "product modified successfully"
            });
            isFound = true
            break;
        }
    }
    if (!isFound) {
        res.status(404)
        res.send({
            message: "edit fail: product not found"
        });
    }
    res.send({
        message: "product added successfully"
    });
})






const __dirname = path.resolve();
app.use('/', express.static(path.join(__dirname, './product/build')))
app.use('*', express.static(path.join(__dirname, './product/build')))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

/////////////////////////////////////////////////////////////////////////////////////////////////

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////