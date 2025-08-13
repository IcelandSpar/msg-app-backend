const express = require('express');
const { createServer } = require("http");
const { Server } = require('socket.io');
const cors = require('cors');
const passport = require('passport');


const app = express();
app.use(cors());

require('./passport/jwtStrategyConfig.js');


const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173']
  }
});

app.get('/', passport.authenticate('jwt', {session: false}),  (req, res) => {
  res.json({
    hello: 'world'
  })
});

io.on('connection', (socket) => {
  console.log('client has connected')
  socket.emit('connection', 'welcome to the chat!')


  socket.on('button press', () => {
    io.emit('button press', socket.id + ' pressed the button');
  })

  socket.on('disconnecting', (reason) => {
    io.emit('user left', socket.id + ' left for some reason');
  })

})



httpServer.listen(3000, () => {
  console.log(`listening on port ${3000}`)
})