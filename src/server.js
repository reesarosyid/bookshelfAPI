const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'], // Allow all origins
      },
    },
  });

  // Register routes
  server.route(routes);

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};
init();