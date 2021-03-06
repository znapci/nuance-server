const User = require('./models/user')

const sockets = (server) => {
  const { Server } = require('socket.io')

  const { socketsAuth, onChatMessage, onDelivery, onInitialConnection, onInitialContactRequest, onGetChats } = require('./controllers/sockets')
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: '*'
    }
  })
  // on first connection check if user is authorised
  io.use(socketsAuth)

  io.on('connection', socket => {
    const user = new User()
    // socket.on('initialConnection', () => {
    //   onInitialConnection(socket)
    // })
    onInitialConnection(socket)
    socket.on('chatMessage', (data, sendAck) => {
      onChatMessage(data, sendAck, socket)
    })
    socket.on('deliveryReport', (data) => {
      onDelivery(data, socket)
    })
    socket.on('getChats', (data) => {
      onGetChats(data, socket)
    })
    socket.on('disconnect', () => {
      console.log('User disconnected', socket.userId)
      user.setSocketId('', socket.userId)
    })
  })
}

exports.sockets = sockets
