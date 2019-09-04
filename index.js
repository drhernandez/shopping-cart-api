const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api/swagger/swagger.json');
const logger = require('./api/utils/loggerFactory').createLogger(__filename);

//Routers
const cartsRouter = require('./api/routers/cartsRouter');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
app.use('/carts', cartsRouter);

const PORT = process.env.PORT || 9000
app.listen(PORT, () => {
  logger.info(`env ${process.env.NODE_ENV}`)
  logger.info(`scope ${process.env.NODE_SCOPE}`)
  logger.info(`Server listening on port ${PORT}`);
});