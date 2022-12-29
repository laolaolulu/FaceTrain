const { generateService } = require('@umijs/openapi');

generateService({
  schemaPath: 'https://localhost:54321/swagger/v1/swagger.json',
  serversPath: './servers',
});
