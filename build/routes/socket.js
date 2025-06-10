"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const log_js_1 = require("../utils/log.js");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.server = http_1.default.createServer(exports.app);
const io = new socket_io_1.Server(exports.server, {
    cors: {
        origin: process.env.ORIGIN_URL,
        methods: ["GET", "POST"],
    },
    maxHttpBufferSize: 2e7,
});
let roomUsers = {};
io.on("connection", (socket) => {
    io.emit("users_response", roomUsers);
    (0, log_js_1.log)(`User Connected: ${socket.id}`);
    socket.on("join_room", (roomId) => {
        var _a;
        socket.join(roomId);
        roomUsers = Object.assign(Object.assign({}, roomUsers), { [roomId]: [...((_a = roomUsers[roomId]) !== null && _a !== void 0 ? _a : []), socket.id] });
        io.emit("users_response", roomUsers);
        (0, log_js_1.log)(`User with ID: ${socket.id} joined room: ${roomId}`);
    });
    socket.on("send_message", (data) => {
        io.emit("receive_message", data);
    });
    socket.on("typing", (data) => {
        socket.broadcast.emit("typing_response", data);
    });
    socket.on("disconnect", () => {
        (0, log_js_1.log)("User Disconnected " + socket.id);
        for (const [roomId, users] of Object.entries(roomUsers)) {
            if (users.includes(socket.id)) {
                roomUsers[roomId] = [...users.filter((id) => id !== socket.id)];
                io.emit("receive_message", {
                    text: "A user left the room.",
                    socketId: "kurakani",
                    roomId: roomId,
                });
            }
        }
        io.emit("users_response", roomUsers);
    });
});
