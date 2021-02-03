const express = require('express');
var bodyParser = require('body-parser');
require('dotenv').config();
const axios = require('axios');
const app = express();
var swaggerUi = require('swagger-ui-express');

swaggerDocument = require('./swagger.json');
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//ENPOINTS
app.get('/searchProductByTitle', async (req, res) => {
  const searchStr = req.query.title.toLowerCase();
  let productList = await getProductList();

  let filteredProductList = productList.filter(item =>
    item.title.toLowerCase().indexOf(searchStr) > -1
  ).map(product => ({ id: product.id, title: product.title,image:{src:product.image.src,width:product.image.width,height:product.image.height} }));
  res.send(JSON.stringify(filteredProductList))
});

//METHODS
async function getProductList() {
  const url = 'https://' + process.env.API_KEY + '@toolio-retail.myshopify.com/admin/api/2021-01/products.json';
  let response = await axios.get(url);
  return response.data.products;
}

app.listen(3005);