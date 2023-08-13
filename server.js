const express = require('express');
const http = require('http')
const path = require('path')

const app = express()
const server = http.createServer(app)

const { Server } = require("socket.io");
const io = new Server(server)


app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client', 'index.html'));
});

app.use(express.static(path.resolve(__dirname, './client')));

//with namespace
// const userIo = io.of("/user")
// userIo.on("connection", socket => {
//     console.log(`connected to user namespace with ${socket.username} username`);
// })
// userIo.use((socket, next) => {
//     //to access token
//     if (socket.handshake.auth.token) {
//         socket.username = socket.handshake.auth.token
//         next()
//     } else {
//         next(new Error("invalid token"))
//     }
// })

io.on("connection", socket => {
    console.log(socket.id);

    socket.on("send-message", (message, room) => {
        if (room) {
            socket.broadcast.to(room).emit("receive-message", message)//send message to special user with user id
        } else {
            // io.emit("receive-message", message)//send to all
            socket.broadcast.emit("receive-message", message)// send message to all exclude itself
        }
    })


    socket.on("join-room", (room, cb) => {
        socket.join(room)
        cb(`joined to ${room}`)
    })


    // socket.on("ping", n => console.log(n))
})

server.listen(3000, () => {
    console.log('listening on 3000');
});