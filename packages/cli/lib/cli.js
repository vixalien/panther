let app = require('../../server');
let { port } = require('./args')(process.argv.slice(2));

let server = app();

server.listen(port, () => server.emit('listened', { port }));
// console.log('Listening on PORT:', PORT);