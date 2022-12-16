import express from "express" 
import path from 'path';
import cors from 'cors';
import mongoose from"mongoose"




const app = express()
const port = process.env.PORT || 3000
const mongodbURI = process.env.mongodbURI || "mongodb+srv://admin:admin123@cluster0.vpuj8pq.mongodb.net/mydatabase?retryWrites=true&w=majority"
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
    myProductModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                message: "got all products successfully",
                data: data
            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
 
})
app.get('/product/:id', (req, res) => {

    const id = req.params.id;

    myProductModel.findOne({ _id: id }, (err, data) => {
        if (!err) {
            if (data) {
                res.send({
                    message: `get product by id: ${data._id} success`,
                    data: data
                });
            } else {
                res.status(404).send({
                    message: "product not found",
                })
            }
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

app.delete('/product/:ids', (req, res) => {
    const id =req.params.ids;
    myProductModel.deleteOne({ _id: id }, (err, deletedData) => {
        console.log("deleted: ", deletedData);
        if (!err) {

            if (deletedData.deletedCount !== 0) {
                res.send({
                    message: "Product has been deleted successfully",
                })
            } else {
                res.status(404);
                res.send({
                    message: "No Product found with this id: " + id,
                });
            }
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });


    
})

app.put('/product/:editId', async (req, res) => {

    const body = req.body;
    const id = req.params.editId;

    if ( // validation
        !body.name
        && !body.price
        && !body.description
    ) {
        res.status(400).send({
            message: "required parameters missing"
        });
        return;
    }

    try {
        let data = await myProductModel.findByIdAndUpdate(id,
            {
                name: body.name,
                price: body.price,
                description: body.description
            },
            { new: true }
        ).exec();

        console.log('updated: ', data);

        res.send({
            message: "product modified successfully"
        });

    } catch (error) {
        res.status(500).send({
            message: "server error"
        })
    }
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