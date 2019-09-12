# shoping-cart-api

Application for shopping carts management. 
This application allows you to create, manage and process shopping carts. The final result is a order created in thirdlove-uat2.myshopify.com API. For more documentation about shopify api, read the [docs](https://help.shopify.com/en/api/reference).

# Tecnology

* Node.js 12.4.0
* PostgreSQL 11.2

## Libraries
* Swagger
* Express
* Bcrypt
* JWT (jsonwebtoken)
* Sequelize
* pg
* Winston

All libraries have been selected base on my knowledge, popularity & community size and reliability.

# Configuration

## Database

Create a PosgreSQL database with name and port of your choise, the access will be configured on the environment variables in the next section.

## Environment variables

To run the project you have to configure the following environment variables:

* NODE_ENV=*environment*

* SHOPIFY_API_KEY=*YOUR SHOPIFY API KEY*
* SHOPIFY_API_PASSWORD=*YOUR SHOPIFY API PASSWORD*

* DB_HOST=*database host url*
* DB_PORT=*database port*
* DB_USERNAME=*database user name*
* DB_PASSWORD=*database user password*
* DB_NAME=*database name*
* DB_POOL_MAX=*database maximum number of connection in pool*
* DB_POOL_MIN=*database minimum number of connection in pool*
* DB_POOL_IDLE=*The maximum time, in milliseconds, that a connection can be idle before being released.*
* DB_SYNC_MODELS=*Flag for model's automatic synchronization*

* TOKEN_SECRET=*JWT token secrets*

Example **.env** file for run the project locally
```
NODE_ENV=development

//Shopify api config
SHOPIFY_API_KEY=YOUR_API_KEY
SHOPIFY_API_PASSWORD=123456789

//DB configs
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=root
DB_NAME=root
DB_POOL_MAX=5
DB_POOL_MIN=1
DB_POOL_IDLE=10000
DB_SYNC_MODELS=true

//JWT
TOKEN_SECRET=123456789
```

## Tests

To run tests execute the following command:
```
 npm install
 npm test
```

## Run

To run the project you have to configure the required environment variables. If you are running locally, create a **.env** file as explained above and run the following commands:
```
 npm install          //if you didn't do it before
 npm start
```

## Hosting

The API is currently hosted on [Heroku](https://www.heroku.com/) under this [url](https://shopping-cart-api-tl.herokuapp.com). You can read the api-docs [here](https://shopping-cart-api-tl.herokuapp.com/api-docs/)
