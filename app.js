const express = require('express');
const { createServer } = require("http");
const { Server } = require('socket.io');
const cors = require('cors');
const passport = require('passport');
const path = require('node:path')

const loginRouter = require('./routes/loginRouter.js');
const registerRouter = require('./routes/registerRouter.js');
const groupActionsRouter = require('./routes/groupActionsRouter.js');

const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/group-actions', groupActionsRouter);

require('./passport/jwtStrategyConfig.js');




const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [`${process.env.DEVELOPMENT}`]
  },
});

io.on("connection", (socket) => {
  socket.emit('connected', 'Welcome to the chat!');


  socket.on('joinRoom', (clientInfo) => {
    socket.join(clientInfo.groupId)
    socket.emit('joinRoomMsg', clientInfo.profileName + ' just joined the room!')
  });

  socket.on('send message', ({ groupId, message }) => {
    console.log('detected')
    socket.broadcast.to(groupId).emit('received message', {
      date: new Date(),
      profileName: 'john doe',
      message: message,
      groupId,
    });
  })



  // app.set("socket", socket)


})



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



// io.on('connection', (socket) => {
//   console.log('a user connected')

//   socket.on('chat message', (msg) => {
//     console.log('message: ' + 'hi')
//     io.emit('chat message', 'message: ' + msg)
//   })
// })



httpServer.listen(3000, () => {
  console.log(`listening on port ${3000}`)
});


