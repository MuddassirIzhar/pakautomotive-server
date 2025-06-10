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
exports.readMessage = exports.CreateMessage = exports.Messages = void 0;
const app_data_source_1 = require("../app-data-source");
const message_entity_1 = require("../entities/message.entity");
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const room_entity_1 = require("../entities/room.entity");
const typeorm_1 = require("typeorm");
const repository = app_data_source_1.Manager.getRepository(message_entity_1.Message);
const repositoryRoom = app_data_source_1.Manager.getRepository(room_entity_1.Room);
let VIDEO_COLLECTION = [
    { file: ".3gp", type: "video/3gpp" },
    { file: ".asf", type: "video/x-ms-asf" },
    { file: ".avi", type: "video/x-msvideo" },
    { file: ".m4u", type: "video/vnd.mpegurl" },
    { file: ".m4v", type: "video/x-m4v" },
    { file: ".mov", type: "video/quicktime" },
    { file: ".mp4", type: "video/mp4" },
    { file: ".mpe", type: "video/mpeg" },
    { file: ".mpeg", type: "video/mpeg" },
    { file: ".mpg", type: "video/mpeg" },
    { file: ".mpg4", type: "video/mp4" },
];
let PHOTO_COLLECTION = [
    { file: ".bmp", type: "image/bmp" },
    { file: ".gif", type: "image/gif" },
    { file: ".jpeg", type: "image/jpeg" },
    { file: ".jpg", type: "image/jpeg" },
    { file: ".png", type: "image/png" },
    { file: ".svg", type: "image/svg+xml" },
];
const Messages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req['user'];
    const id = parseInt(req.params.id);
    const messages = yield repository.find({
        where: [
            // {
            //     room:{
            //         id:id
            //     },
            // },
            {
                room: {
                    id: id
                },
                sender: {
                    id: user.id
                },
                sender_delete: false
            },
            {
                room: {
                    id: id
                },
                receiver: {
                    id: user.id
                },
                receiver_delete: false
            }
        ],
        relations: {
            room: true,
            receiver: true,
            sender: true,
        }
    });
    const unreadMessagesIds = [];
    messages.forEach((message, index) => {
        if (message.status !== "read" && message.sender.id !== user.id) {
            messages[index].status = "read";
            unreadMessagesIds.push(message.id);
        }
    });
    yield repository.update({
        id: (0, typeorm_1.In)(unreadMessagesIds)
    }, {
        status: "read"
    });
    return res.status(200).send({
        status: true,
        message: 'INFO :: Get data successfully.',
        messages
    });
});
exports.Messages = Messages;
const CreateMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req['user'];
    const data = req.body;
    // const room = await repositoryR.findOne({
    const room = yield repositoryRoom.findOne({
        where: {
            id: data.room_id
        },
        relations: {
            sender: true,
            receiver: true
        }
    });
    if (!room) {
        return res.status(404).send({
            status: true,
            message: 'INFO :: Room not found.'
        });
    }
    yield repositoryRoom.update(room.id, {
        sender_delete: false,
        receiver_delete: false
    });
    // room.sender_delete = false;
    // room.receiver_delete = false;
    // if(user.id == room.sender.id){
    //     room.sender_count++;
    // }
    // else {
    //     room.receiver_count++;
    // }
    // room.save();
    let file_extension = null;
    let file;
    let file_type = null;
    let fileType = null;
    let messageType = "text";
    let uploadPath;
    let dir;
    const requestedFiles = req.files;
    if (requestedFiles && Object.keys(requestedFiles).length > 0) {
        // The name of the input field (i.e. "file") is used to retrieve the uploaded file
        if (requestedFiles.file) {
            file = requestedFiles.file;
            fileType = file.mimetype;
            file_extension = (0, path_1.extname)(file.name);
            const newFileName = (new Date().getTime()) + Math.random().toString(20).substring(2, 12) + file_extension;
            // Check if the uploaded file is allowed
            if (PHOTO_COLLECTION.filter(function (v) { return (v.file == file_extension && v.type == fileType); }).length > 0) {
                dir = 'uploads/photo/';
                file_type = 'photo';
                messageType = 'photo';
            }
            else if (VIDEO_COLLECTION.filter(function (v) { return (v.file == file_extension && v.type == fileType); }).length > 0) {
                dir = 'uploads/video/';
                file_type = 'video';
                messageType = 'video';
            }
            else {
                return res.status(400).send({
                    status: false,
                    message: 'Only Photos and Videos are allowed',
                    file_extension,
                    fileType,
                });
            }
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir, { recursive: true });
            }
            uploadPath = dir + newFileName;
            // Use the mv() method to place the file somewhere on your server
            file.mv(uploadPath, function (err) {
                if (err)
                    return res.status(500).send(err);
            });
        }
        if (requestedFiles.audio) {
            file = requestedFiles.audio;
            file_extension = (0, path_1.extname)(file.name);
            const newFileName = (new Date().getTime()) + Math.random().toString(20).substring(2, 12) + file_extension;
            dir = 'uploads/audio/';
            file_type = 'audio';
            messageType = 'audio';
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir, { recursive: true });
            }
            uploadPath = dir + newFileName;
            // Use the mv() method to place the file somewhere on your server
            file.mv(uploadPath, function (err) {
                if (err)
                    return res.status(500).send(err);
            });
        }
    }
    let receiver = room.sender;
    if (user.id == receiver.id) {
        receiver = room.receiver;
    }
    // const getUserData : any = onlineUsers.get(receiver.id);
    let userId = null;
    let status = "sent";
    onlineUsers.forEach((userData, keyObj) => {
        if (keyObj.userId == receiver.id) {
            userId = keyObj.userId;
            status = (keyObj.currentRoom == room.id) ? "read" : "delivered";
        }
    });
    // const getUser = userId;
    const message = yield repository.save({
        room: {
            id: room.id
        },
        message: uploadPath ? uploadPath : data.message,
        sender: {
            id: user.id
        },
        receiver: {
            id: receiver.id
        },
        file: uploadPath,
        file_type: file_type,
        type: messageType,
        // status: getUser ? "delivered" : "sent",
        status: status
    });
    // room.sender_delete = false;
    // room.receiver_delete = false;
    // if(user.id == room.sender.id){
    //     room.sender_count++;
    // }
    // else {
    //     room.receiver_count++;
    // }
    // room.save();
    const senderRooms = yield repositoryRoom.find({
        where: [
            {
                sender: {
                    id: user.id
                },
                sender_delete: false
            },
            {
                receiver: {
                    id: user.id
                },
                receiver_delete: false
            }
        ],
        order: {
            messages: {
                id: "DESC"
            }
        },
        relations: {
            receiver: {
                role: true
            },
            sender: {
                role: true
            },
            messages: {
                receiver: true,
                sender: true,
            },
        }
    });
    const receiverRooms = yield repositoryRoom.find({
        where: [
            {
                sender: {
                    id: receiver.id
                },
                sender_delete: false
            },
            {
                receiver: {
                    id: receiver.id
                },
                receiver_delete: false
            }
        ],
        order: {
            messages: {
                id: "DESC"
            }
        },
        relations: {
            receiver: {
                role: true
            },
            sender: {
                role: true
            },
            messages: {
                receiver: true,
                sender: true,
            },
        }
    });
    let unreadSenderMessages = 0;
    senderRooms.forEach(room => {
        var unread = room.messages.filter(function (v, i) {
            return (v.receiver.id == user.id && v.status !== "read");
            // return ( v.receiver == user && v.read_at == null );
        });
        room.unreadMessages = unread.length;
        if ((room.messages.length && room.messages[0].receiver.id == user.id && room.messages[0].receiver_delete == false) ||
            (room.messages.length && room.messages[0].sender.id == user.id && room.messages[0].sender_delete == false)) {
            room.lastMessage = room.messages[0];
        }
        unreadSenderMessages += unread.length;
    });
    let unreadMessages = 0;
    let unreadReceiverMessages = 0;
    receiverRooms.forEach(room => {
        var unread = room.messages.filter(function (v, i) {
            return (v.receiver.id == receiver.id && v.status !== "read");
            // return ( v.receiver.id == receiver.id && v.read_at == null );
        });
        room.unreadMessages = unread.length;
        if ((room.messages.length && room.messages[0].receiver.id == user.id && room.messages[0].receiver_delete == false) ||
            (room.messages.length && room.messages[0].sender.id == user.id && room.messages[0].sender_delete == false)) {
            room.lastMessage = room.messages[0];
        }
        unreadReceiverMessages += unread.length;
    });
    return res.status(200).send({
        status: true,
        message,
        sender: user,
        senderRooms,
        unreadSenderMessages,
        receiver,
        receiverRooms,
        unreadReceiverMessages,
        unreadMessages,
    });
});
exports.CreateMessage = CreateMessage;
const readMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield repository.update(req.params.id, {
        read_at: new Date(),
    });
    return res.status(200).send({
        status: true,
        message: 'INFO :: Message read successfully.'
    });
});
exports.readMessage = readMessage;
