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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRoom = exports.CreateRoom = exports.GetRoom = exports.MyRooms = exports.Rooms = void 0;
const typeorm_1 = require("typeorm");
const app_data_source_1 = require("../app-data-source");
const message_entity_1 = require("../entities/message.entity");
const room_entity_1 = require("../entities/room.entity");
const repository = app_data_source_1.Manager.getRepository(room_entity_1.Room);
const repositoryMessage = app_data_source_1.Manager.getRepository(message_entity_1.Message);
let MIME_COLLECTION = [
    { file: ".3gp", type: "video/3gpp" },
    { file: ".asf", type: "video/x-ms-asf" },
    { file: ".avi", type: "video/x-msvideo" },
    { file: ".bmp", type: "image/bmp" },
    { file: ".gif", type: "image/gif" },
    { file: ".jpeg", type: "image/jpeg" },
    { file: ".jpg", type: "image/jpeg" },
    { file: ".m4u", type: "video/vnd.mpegurl" },
    { file: ".m4v", type: "video/x-m4v" },
    { file: ".mov", type: "video/quicktime" },
    { file: ".mp4", type: "video/mp4" },
    { file: ".mpe", type: "video/mpeg" },
    { file: ".mpeg", type: "video/mpeg" },
    { file: ".mpg", type: "video/mpeg" },
    { file: ".mpg4", type: "video/mp4" },
    { file: ".png", type: "image/png" }
];
const Rooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield repository.find({
        where: [
            {
                messages: {
                    sender_delete: false
                },
                sender_delete: false
            },
            {
                messages: {
                    receiver_delete: false
                },
                sender_delete: false
            },
            {
                sender_delete: false
            },
            {
                receiver_delete: false
            }
        ],
        order: {
            updated_at: "DESC",
            messages: {
                id: "DESC"
            },
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
    rooms.forEach(room => {
        room.lastMessage = room.messages[0];
    });
    return res.status(200).send({
        status: true,
        message: 'INFO :: Get all rooms successfully.',
        rooms
    });
});
exports.Rooms = Rooms;
const MyRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req['user'];
    const rooms = yield repository.find({
        where: [
            {
                messages: {
                    sender: {
                        id: user.id
                    },
                    sender_delete: false
                },
                sender: {
                    id: user.id
                },
                sender_delete: false
            },
            {
                messages: {
                    sender: {
                        id: user.id
                    },
                    sender_delete: false
                },
                receiver: {
                    id: user.id
                },
                receiver_delete: false
            },
            {
                messages: {
                    receiver: {
                        id: user.id
                    },
                    receiver_delete: false
                },
                sender: {
                    id: user.id
                },
                sender_delete: false
            },
            {
                messages: {
                    receiver: {
                        id: user.id
                    },
                    receiver_delete: false
                },
                receiver: {
                    id: user.id
                },
                receiver_delete: false
            },
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
            updated_at: "DESC",
            messages: {
                id: "DESC"
            },
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
    let totalUnreadMessages = 0;
    rooms.forEach(room => {
        let unreadMessages = 0;
        var unread = room.messages.filter(function (v, i) {
            if (v.receiver.id == user.id && v.status === "sent") {
                v.status = "delivered";
                v.save();
            }
            return (v.receiver.id == user.id && v.status !== "read");
        });
        unreadMessages += unread.length;
        if ((room.messages.length && room.messages[0].receiver.id == user.id && room.messages[0].receiver_delete == false) ||
            (room.messages.length && room.messages[0].sender.id == user.id && room.messages[0].sender_delete == false)) {
            room.lastMessage = room.messages[0];
        }
        room.unreadMessages = unreadMessages;
        totalUnreadMessages += unreadMessages;
    });
    return res.status(200).send({
        status: true,
        message: 'INFO :: Get data successfully.',
        rooms,
        totalUnreadMessages
    });
});
exports.MyRooms = MyRooms;
const GetRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req['user'];
    const id = req.params.id;
    const room = yield repository.findOne({
        where: [
            {
                id: id,
                messages: {
                    sender: {
                        id: user.id
                    },
                    sender_delete: false
                },
                sender: {
                    id: user.id
                }
            },
            {
                id: id,
                messages: {
                    sender: {
                        id: user.id
                    },
                    sender_delete: false
                },
                receiver: {
                    id: user.id
                }
            },
            {
                id: id,
                messages: {
                    receiver: {
                        id: user.id
                    },
                    receiver_delete: false
                },
                sender: {
                    id: user.id
                }
            },
            {
                id: id,
                messages: {
                    receiver: {
                        id: user.id
                    },
                    receiver_delete: false
                },
                receiver: {
                    id: user.id
                }
            },
        ],
        order: {
            messages: {
                id: "DESC"
            }
        },
        relations: {
            messages: {
                receiver: true,
                sender: true,
            },
        }
    });
    if (!room) {
        return res.status(404).send({
            status: true,
            message: 'INFO :: Room not found.'
        });
    }
    yield repositoryMessage.update({
        room: {
            id: id
        },
        receiver: {
            id: user.id
        },
        read_at: (0, typeorm_1.IsNull)()
    }, {
        read_at: new Date()
    });
    let unreadMessages = 0;
    const rooms = yield repository.find({
        where: [
            {
                messages: {
                    sender: {
                        id: user.id
                    },
                    sender_delete: false
                },
                sender: {
                    id: user.id
                }
            },
            {
                messages: {
                    sender: {
                        id: user.id
                    },
                    sender_delete: false
                },
                receiver: {
                    id: user.id
                }
            },
            {
                messages: {
                    receiver: {
                        id: user.id
                    },
                    receiver_delete: false
                },
                sender: {
                    id: user.id
                }
            },
            {
                messages: {
                    receiver: {
                        id: user.id
                    },
                    receiver_delete: false
                },
                receiver: {
                    id: user.id
                }
            },
        ],
        order: {
            updated_at: "DESC"
        },
        relations: {
            receiver: true,
            sender: true,
            messages: {
                receiver: true,
                sender: true,
            },
        }
    });
    rooms.forEach(room => {
        var unread = room.messages.filter(function (v, i) {
            return (v.receiver.id == user.id && v.read_at == null);
        });
        unreadMessages += unread.length;
    });
    return res.status(200).send({
        status: true,
        message: 'INFO :: Get data successfully.',
        room,
        unreadMessages,
        receiver: user,
    });
});
exports.GetRoom = GetRoom;
const CreateRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req['user'];
    const data = req.body;
    const check = yield repository.findOne({
        where: [
            {
                sender: {
                    id: user.id
                },
                receiver: {
                    id: data.id
                }
            },
            {
                sender: {
                    id: data.id
                },
                receiver: {
                    id: user.id
                }
            },
        ],
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
    if (check) {
        const newRoom = yield repository.save({
            id: check.id,
            receiver_delete: false,
            sender_delete: false
        });
        const room = yield repository.findOne({
            where: [
                {
                    id: newRoom.id
                }
            ],
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
        if (room)
            room.unreadMessages = 0;
        return res.status(200).send({
            status: true,
            message: 'INFO :: Room Already exist.',
            room,
            data
        });
    }
    else {
        const existingRoom = yield repository.save({
            sender: user.id,
            receiver: data.id,
            receiver_delete: true,
        });
        const room = yield repository.findOne({
            where: [
                {
                    id: existingRoom.id
                }
            ],
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
        if (room)
            room.unreadMessages = 0;
        return res.status(200).send({
            status: true,
            message: 'INFO :: Room created successfully.',
            room,
            data
        });
    }
});
exports.CreateRoom = CreateRoom;
const DeleteRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req['user'];
    const id = req.params.id;
    const room = yield repository.findOne({
        where: [
            {
                id: id,
            },
        ],
        relations: {
            receiver: true,
            sender: true,
        }
    });
    if (!room) {
        return res.status(404).send({
            status: true,
            message: 'INFO :: Room not found.'
        });
    }
    if (room.sender.id == user.id) {
        room.sender_delete = true;
    }
    if (room.receiver.id == user.id) {
        room.receiver_delete = true;
    }
    yield repositoryMessage.update({
        room: {
            id: room.id
        },
        sender: {
            id: user.id
        }
    }, {
        sender_delete: true
    });
    yield repositoryMessage.update({
        room: {
            id: room.id
        },
        receiver: {
            id: user.id
        }
    }, {
        receiver_delete: true
    });
    room.save();
    return res.status(200).send({
        status: true,
        message: 'Chat successfully deleted!'
    });
});
exports.DeleteRoom = DeleteRoom;
