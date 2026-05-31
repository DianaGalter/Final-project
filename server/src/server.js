import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './shared/config/db.js';
import { env } from './shared/config/env.js';

const start = async () => {
  await connectDB();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: [env.storefrontUrl, env.crmUrl],
      methods: ['GET', 'POST'],
    },
  });

  app.set('io', io);

  io.on('connection', (socket) => {
    socket.on('join:inventory', () => {
      socket.join('inventory');
    });
  });

  server.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
