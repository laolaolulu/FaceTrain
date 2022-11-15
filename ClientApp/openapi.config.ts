const { generateService } = require('@umijs/openapi');

generateService({
  schemaPath: 'https://localhost:7048/swagger/v1/swagger.json',
  serversPath: './servers',
});
