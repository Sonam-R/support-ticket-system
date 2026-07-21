const swaggerUi = require('swagger-ui-express');
const openApiSpec = require('./openapi');

const swaggerUiOptions = {
  customSiteTitle: 'Support Ticket API Docs',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
  },
};

const swaggerServe = swaggerUi.serve;
const swaggerSetup = swaggerUi.setup(openApiSpec, swaggerUiOptions);

module.exports = {
  openApiSpec,
  swaggerServe,
  swaggerSetup,
};
