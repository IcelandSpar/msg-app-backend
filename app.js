const express = require('express');
const { createServer } = require("http");
const { Server } = require('socket.io');
const cors = require('cors');
const passport = require('passport');

const loginRouter = require('./routes/loginRouter.js');
const registerRouter = require('./routes/registerRouter.js');

const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }))

app.use('/register', registerRouter);
app.use('/login', loginRouter);

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

app.get('/protected-route', passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const user = jwt.verify(token, process.env.JWT_SECRET);  
  res.json({
    user,
    protected: 'route'
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