const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(cors());

const server = require("http").Server(app);
const io = require("socket.io")(server); //ouvir http e web sockets

io.on("connection", socket => {
    socket.on('connectRoom', box => {
        socket.join(box);
    })
});

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-2soeh.mongodb.net/omnistack?retryWrites=true',
{
    useNewUrlParser: true
});

app.use((req, res, next) => {
    req.io = io;

    return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //permite envio de arquivos
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));

app.use(require("./routes"));

server.listen(process.env.PORT || 3333);