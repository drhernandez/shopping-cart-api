//Load env vars
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api/swagger/swagger.json');
const logger = require('./api/utils/loggerFactory').createLogger(__filename);
const db = require('./api/db/models');
const { usersRouter, cartsRouter, authenticationRouter, checkoutRouter } = require('./api/routers');
const PORT = process.env.PORT || 9000;


initializeExpress();
initializeModels().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
  });
}).catch((err) => {
  logger.error(`[message: error initializing models] [error: ${err}]`);
});




function initializeExpress() {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
  app.use('/authentication', authenticationRouter);
  app.use('/users', usersRouter);
  app.use('/carts', cartsRouter);
  app.use('/checkout', checkoutRouter);
}

async function initializeModels() {
  await db.User.sync();
  await db.Order.sync();
  await db.Cart.sync();
  await db.CartItem.sync();
}