const db = require('../../api/db/models');
const http = require('http');
const mockserver = require('mockserver');

//MOCK SERVER
before((done) => {
  http.createServer(mockserver(`${__dirname}/../mocks`)).listen(9999);
  done();
})

const cleanDatabase = () => (
  Promise.all(
    Object.keys(db).map((key) => {
      if (['sequelize', 'Sequelize'].includes(key)) return null;
      return db[key].destroy({ where: {}, force: true });
    }),
  )
)

const createTestUser = async () => (
  await db.User.create(testUser1)
)

const createTestUserFromName = async (name) => (
  await db.User.create(testusers.get(name))
)

const createTestCart = async () => {
  const user = await createTestUser();
  const cart = await db.Cart.create(testCart);
  await cart.setBuyer(user);
  await cart.createCartItem(testCartItem);
  return cart;
}

const createTestCartWithNoInventory = async () => {
  const cart = await createTestCart();
  await cart.createCartItem(testCartItemNoInventory);
}

module.exports = {
  cleanDatabase,
  createTestUser,
  createTestUserFromName,
  createTestCart,
  createTestCartWithNoInventory
}

const testUser1 = { 
  name: 'test', 
  lastName: 'test', 
  email: 'test@test.com', 
  password: '$2b$10$E0E7jb4XkRm8hIGedEXLielOPim99dHt3sgN1WLXTDmg7GHa05uZu' 
}

const testUser2 = {
  name: 'test2',
  lastName: 'test2',
  email: 'test2@test.com',
  password: '$2b$10$kAIjhe1WDuPZUs95wlafm.O7mCV8EN.J1GtxCq.zfAaDp4SwBltDW'
}

const testusers = new Map();
testusers.set(testUser1.name, testUser1);
testusers.set(testUser2.name, testUser2);

const testCart = { 
  id: 1000000, 
  status: 'created' 
}

const testCartItem = {
  variant_id: 987654321,
  quantity: 10
}

const testCartItemNoInventory = {
  variant_id: 123456789,
  quantity: 10
}