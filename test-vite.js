const { createServer } = require('vite');

async function startServer() {
  try {
    console.log('Creating Vite server...');
    const server = await createServer({
      server: {
        port: 3000,
      },
    });

    console.log('Starting server...');
    await server.listen();

    console.log('Server started successfully!');
    server.printUrls();
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();
