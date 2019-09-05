const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api/swagger/swagger.json');
const logger = require('./api/utils/loggerFactory').createLogger(__filename);

//Load env vars
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// const Buyer = require('./api/db/models').Buyer;
// const CartItem = require('./api/db/models').CartItem;
// const Cart = require('./api/db/models').Cart;
// Buyer.create({ name: 'Diego' }).then(buyer => {
//   Buyer.findAll().then(buyers => {
//     buyers.forEach(buyer => {
//       console.log('buyer: ' + JSON.stringify(buyer.dataValues));
//     });
//   })
// })

//Routers
const cartsRouter = require('./api/routers/cartsRouter');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
app.use('/carts', cartsRouter);

const PORT = process.env.PORT || 9000
app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});