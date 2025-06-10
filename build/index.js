"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const service_routes_1 = __importDefault(require("./routes/service.routes"));
const permission_routes_1 = __importDefault(require("./routes/permission.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const role_routes_1 = __importDefault(require("./routes/role.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import { router as roomRoutes } from "./routes/roomRoutes.js";
const room_routes_1 = __importDefault(require("./routes/room.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const reminder_routes_1 = __importDefault(require("./routes/reminder.routes"));
const patient_routes_1 = __importDefault(require("./routes/patient.routes"));
const app_data_source_1 = require("./app-data-source");
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
global.onlineUsers = new Map();
// establish database connection
app_data_source_1.myDataSource
    .initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    // productSeed()
    // orderSeed()
    console.log('INFO :: Data Source has been initialized');
}))
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
const apiUrl = process.env.API_URL;
const expressPort = process.env.WEB_PORT || 8080;
const app = (0, express_1.default)();
// default options
app.use((0, express_fileupload_1.default)({ uriDecodeFileNames: true }));
// use json for API routes
app.use(express_1.default.json());
// cors for api address/port
app.use((0, cors_1.default)({
    credentials: true,
    origin: ["http://localhost:3000", "https://pakautomotive.com"],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
}));
// cookieParser middleware
app.use((0, cookie_parser_1.default)());
app.get('/', (req, res) => {
    console.log(req.cookies);
    res.send('INFO :: Root route called');
});
// app.listen(expressPort, () => {
//     console.log('INFO :: Webserver started on port ' + expressPort)
// });
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.ORIGIN_URL,
        methods: ["GET", "POST"],
        credentials: true
    },
    maxHttpBufferSize: 2e7,
});
let roomUsers = {};
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (data) => {
        let userData = {
            userId: data.userId,
            currentRoom: data.currentRoom
        };
        onlineUsers.forEach((value, key) => {
            if (key.userId == data.userId) {
                onlineUsers.delete(key);
            }
            if (value == socket.id) {
                onlineUsers.delete(key);
            }
        });
        onlineUsers.set(userData, socket.id);
        io.sockets.emit("online-users", {
            onlineUsers: [...onlineUsers],
            userId: userData.userId
        });
    });
    socket.on("user-read-chat", (data) => {
        let readData = {
            room_id: data.room_id,
            readBy: data.readBy
        };
        io.sockets.emit("chat-read", readData);
    });
    socket.on("send-msg", (data) => {
        let sendUserSocket = [];
        onlineUsers.forEach((userData, keyObj) => {
            if (keyObj.userId == data.message.receiver.id) {
                sendUserSocket.push(userData);
            }
        });
        if (sendUserSocket.length) {
            var uniqSockets = [...new Set(sendUserSocket)];
            socket.to(uniqSockets).emit("msg-receive", {
                room_id: data.room_id,
                message: data.message,
                senderRooms: data.senderRooms,
                unreadSenderMessages: data.unreadSenderMessages,
                receiverRooms: data.receiverRooms,
                unreadReceiverMessages: data.unreadReceiverMessages,
            });
        }
    });
    socket.on("disconnect", () => {
        console.log("User Disconnected " + socket.id);
        onlineUsers.forEach((value, key) => {
            if (value == socket.id) {
                onlineUsers.delete(key);
            }
        });
        // let filterValues = new Map<{ userId : number, currentRoom : number | undefined}, string>();
        // [...onlineUsers].forEach(item =>
        // {
        //     if(item[1] !== socket.id){
        //         filterValues.set(item[0],item[1]);
        //     }
        // });
        // onlineUsers.clear();
        // [...filterValues].forEach(item => {
        //     onlineUsers.set(item[0],item[1]);
        // });
        io.sockets.emit("online-users", {
            onlineUsers: [...onlineUsers]
        });
    });
    // io.emit("users_response", roomUsers);
    // log(`User Connected: ${socket.id}`);
    // socket.on("join_room", (roomId: string) => {
    //     socket.join(roomId);
    //     roomUsers = {
    //         ...roomUsers,
    //         [roomId]: [...(roomUsers[roomId] ?? []), socket.id],
    //     };
    //     io.emit("users_response", roomUsers);
    //     log(`User with ID: ${socket.id} joined room: ${roomId}`);
    // });
    // socket.on("send_message", (data) => {
    //     io.emit("receive_message", data);
    // });
    // socket.on("typing", (data) => {
    //     socket.broadcast.emit("typing_response", data);
    // });
    // socket.on("disconnect", () => {
    //     log("User Disconnected " + socket.id);
    //     for (const [roomId, users] of Object.entries(roomUsers)) {
    //         if (users.includes(socket.id)) {
    //             roomUsers[roomId] = [...users.filter((id) => id !== socket.id)];
    //             io.emit("receive_message", {
    //                 text: "A user left the room.",
    //                 socketId: "kurakani",
    //                 roomId: roomId,
    //             });
    //         }
    //     }
    //     io.emit("users_response", roomUsers);
    // });
});
// import routes from router
app.use('/api', user_routes_1.default);
app.use('/api', service_routes_1.default);
app.use('/api', order_routes_1.default);
app.use('/api', permission_routes_1.default);
app.use('/api', product_routes_1.default);
app.use('/api', role_routes_1.default);
app.use('/api', room_routes_1.default);
app.use('/api', message_routes_1.default);
app.use('/api', reminder_routes_1.default);
app.use('/api', patient_routes_1.default);
app.use('/uploads/video/', express_1.default.static(path_1.default.join(__dirname, '/../uploads/video')));
app.use('/uploads/photo/', express_1.default.static(path_1.default.join(__dirname, '/../uploads/photo')));
app.use('/uploads/audio/', express_1.default.static(path_1.default.join(__dirname, '/../uploads/audio')));
server.listen(expressPort, () => {
    console.log('INFO :: Webserver started on port ' + expressPort);
});
