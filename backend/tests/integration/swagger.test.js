const { api } = require('../helpers');
const { openApiSpec } = require('../../src/config/swagger');

describe('Swagger API documentation', () => {
  it('serves Swagger UI at GET /api/docs', async () => {
    const response = await api().get('/api/docs/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('swagger-ui');
  });

  it('documents all API endpoints', () => {
    const paths = Object.keys(openApiSpec.paths);

    expect(paths).toEqual(
      expect.arrayContaining([
        '/health',
        '/api/tickets',
        '/api/tickets/{id}',
        '/api/tickets/{id}/status',
        '/api/tickets/{ticketId}/comments',
        '/api/users',
      ]),
    );
  });

  it('documents ticket list query parameters', () => {
    const parameters = openApiSpec.paths['/api/tickets'].get.parameters.map(
      (parameter) => parameter.name,
    );

    expect(parameters).toEqual(
      expect.arrayContaining([
        'page',
        'limit',
        'status',
        'priority',
        'assignedTo',
        'search',
        'sortBy',
        'order',
      ]),
    );
  });
});
