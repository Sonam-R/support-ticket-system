const {
  prisma,
  cleanDatabase,
  createTestUser,
  createTestAgent,
} = require('./helpers');

let testCustomer;
let testAgent;

beforeAll(async () => {
  await cleanDatabase();

  testCustomer = await createTestUser({ name: 'Test Customer' });
  testAgent = await createTestAgent();
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

global.getTestCustomer = () => testCustomer;
global.getTestAgent = () => testAgent;
