const Hapi = require('hapi');
const Good = require('good');
const inert = require('inert');

const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });

server.register(inert, (err) => {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/hello',
    handler: function helloHandler(request, reply) {
      reply.file('./public/hello.txt');
    }
  });
});

server.route({
  method: 'GET',
  path: '/',
  handler: function rootHandler(request, reply) {
    reply('Hello, world!');
  }
});

server.route({
  method: 'GET',
  path: '/{name}',
  handler: function nameHandler(request, reply) {
    reply(`Hello, ${encodeURIComponent(request.params.name)}!`);
  }
});

server.register({
  register: Good,
  options: {
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{
          response: '*',
          log: '*'
        }]
      }, {
        module: 'good-console'
      }, 'stdout']
    }
  }
}, (err) => {
  if (err) {
    throw err;
  }

  server.start((startErr) => {
    if (startErr) {
      throw startErr;
    }

    server.log('info', `Server running at ${server.info.uri}`);
  });
});
