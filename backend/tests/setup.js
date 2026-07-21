const {
  prisma,
  cleanDatabase,
  createTestUser,
  createTestAgent,
  createTestAdmin,
  loginAs,
} = require('./helpers');

let testCustomer;
let testAgent;
let testAdmin;
let testCustomerToken;
let testAgentToken;
let testAdminToken;

beforeAll(async () => {
  await cleanDatabase();

  testCustomer = await createTestUser({ name: 'Test Customer' });
  testAgent = await createTestAgent();
  testAdmin = await createTestAdmin();

  testCustomerToken = await loginAs(testCustomer);
  testAgentToken = await loginAs(testAgent);
  testAdminToken = await loginAs(testAdmin);
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

global.getTestCustomer = () => testCustomer;
global.getTestAgent = () => testAgent;
global.getTestAdmin = () => testAdmin;
global.getTestCustomerToken = () => testCustomerToken;
global.getTestAgentToken = () => testAgentToken;
global.getTestAdminToken = () => testAdminToken;
