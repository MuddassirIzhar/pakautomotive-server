import { Request, Response } from "express";
import { Manager } from "../app-data-source";
import { Message } from "../entities/message.entity";
import multer from 'multer';
import path, { extname } from 'path';
import fs from 'fs';
import { Room } from "../entities/room.entity";
import { In } from "typeorm";

const repository = Manager.getRepository(Message);
const repositoryRoom = Manager.getRepository(Room);

interface MulterRequest extends Request {
    files: any;
}

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

export const Messages = async (req: Request, res: Response) => {
    const user = req['user'];
    const id = parseInt (req.params.id);
    const messages = await repository.find({
        where: [
            // {
            //     room:{
            //         id:id
            //     },
            // },
            {
                room:{
                    id:id
                },
                sender: {
                    id:user.id
                },
                sender_delete:false
            },
            {
                room:{
                    id:id
                },
                receiver: {
                    id:user.id
                },
                receiver_delete:false
            }
        ],
        relations: {
            room:true,
            receiver: true,
            sender: true,
        }
    })
    const unreadMessagesIds: number[] = [];
    messages.forEach((message,index) => {
        if(message.status !== "read" && message.sender.id !== user.id){
            messages[index].status = "read";
            unreadMessagesIds.push(message.id);

        }
    });
    await repository.update({
        id: In(unreadMessagesIds)
    }, {
        status: "read"
    })
    return res.status(200).send({
        status: true,
        message: 'INFO :: Get data successfully.',
        messages
    })
}

export const CreateMessage = async (req: Request, res: Response) => {
    const user = req['user'];
    const data = req.body;
    // const room = await repositoryR.findOne({
    const room = await repositoryRoom.findOne({
        where:{
            id:data.room_id
        },
        relations:{
            sender:true,
            receiver:true
        }
    });

    if (!room) {
        return res.status(404).send({
            status: true,
            message: 'INFO :: Room not found.'
        })
    }

    await repositoryRoom.update(room.id, {
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


    
    let file_extension: any = null;
    let file;
    let file_type: any = null;
    let fileType: any = null;
    let messageType: string = "text";
    let uploadPath;
    let dir;
    const requestedFiles  = (req as MulterRequest).files;
    if (requestedFiles && Object.keys(requestedFiles).length > 0) {
        // The name of the input field (i.e. "file") is used to retrieve the uploaded file
        if(requestedFiles.file){
            file = requestedFiles.file;
            fileType = file.mimetype;
            
            file_extension = extname(file.name);
            const newFileName = (new Date().getTime()) + Math.random().toString(20).substring(2, 12) + file_extension;

            // Check if the uploaded file is allowed
            if (PHOTO_COLLECTION.filter(function(v) {return ( v.file == file_extension && v.type == fileType )}).length > 0) {
                dir = 'uploads/photo/';
                file_type = 'photo';
                messageType='photo';
            } else if (VIDEO_COLLECTION.filter(function(v) {return ( v.file == file_extension && v.type == fileType )}).length > 0) {
                dir = 'uploads/video/';
                file_type = 'video';
                messageType='video';
            } else {
                return res.status(400).send({
                    status: false,
                    message: 'Only Photos and Videos are allowed',
                    file_extension,
                    fileType,
                })
            }
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            uploadPath = dir + newFileName;
            // Use the mv() method to place the file somewhere on your server
            file.mv(uploadPath, function(err:any) {
                if (err)
                return res.status(500).send(err);
            });
        }
        if(requestedFiles.audio){
            
            file = requestedFiles.audio;
            file_extension = extname(file.name);
            const newFileName = (new Date().getTime()) + Math.random().toString(20).substring(2, 12) + file_extension;
            dir = 'uploads/audio/';
            file_type = 'audio';
            messageType='audio';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            uploadPath = dir + newFileName;
            // Use the mv() method to place the file somewhere on your server
            file.mv(uploadPath, function(err:any) {
                if (err)
                return res.status(500).send(err);
            });
        }
    }

    let receiver = room.sender;
    if(user.id == receiver.id){
        receiver = room.receiver;
    }

    // const getUserData : any = onlineUsers.get(receiver.id);
    let userId = null;
    let status = "sent";
    onlineUsers.forEach((userData : string,keyObj : any) => {
        if(keyObj.userId == receiver.id){
            userId = keyObj.userId;
            status = (keyObj.currentRoom == room.id) ? "read":"delivered";
        }
    });
    // const getUser = userId;
    const message = await repository.save({
        room:{
            id:room.id
        },
        message:uploadPath ? uploadPath : data.message,
        sender:{
            id:user.id
        },
        receiver:{
            id:receiver.id
        },
        file:uploadPath,
        file_type:file_type,
        type:messageType,
        // status: getUser ? "delivered" : "sent",
        status:status
    })
    // room.sender_delete = false;
    // room.receiver_delete = false;
    // if(user.id == room.sender.id){
    //     room.sender_count++;
    // }
    // else {
    //     room.receiver_count++;
    // }
    // room.save();

    const senderRooms = await repositoryRoom.find({
        where: [
            {
                sender: {
                    id:user.id
                },
                sender_delete:false
            },
            {
                receiver: {
                    id:user.id
                },
                receiver_delete:false
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
    })
    const receiverRooms = await repositoryRoom.find({
        where: [
            {
                sender: {
                    id:receiver.id
                },
                sender_delete:false
            },
            {
                receiver: {
                    id:receiver.id
                },
                receiver_delete:false
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
    })
    let unreadSenderMessages = 0;
    senderRooms.forEach(room => {
        var unread = room.messages.filter(function(v, i) {
            return ( v.receiver.id == user.id && v.status !== "read" );
            // return ( v.receiver == user && v.read_at == null );
        })
        room.unreadMessages = unread.length;
        if(
            (room.messages.length && room.messages[0].receiver.id == user.id && room.messages[0].receiver_delete == false) || 
            (room.messages.length && room.messages[0].sender.id == user.id && room.messages[0].sender_delete == false)
        ) {
            room.lastMessage = room.messages[0];
        }
        unreadSenderMessages += unread.length;
    });
    let unreadMessages = 0;
    let unreadReceiverMessages = 0;
    receiverRooms.forEach(room => {
        var unread = room.messages.filter(function(v, i) {
            return ( v.receiver.id == receiver.id && v.status !== "read" );
            // return ( v.receiver.id == receiver.id && v.read_at == null );
        })
        room.unreadMessages = unread.length;
        if(
            (room.messages.length && room.messages[0].receiver.id == user.id && room.messages[0].receiver_delete == false) || 
            (room.messages.length && room.messages[0].sender.id == user.id && room.messages[0].sender_delete == false)
        ) {
            room.lastMessage = room.messages[0];
        }
        unreadReceiverMessages += unread.length;
    });
    return res.status(200).send({
        status: true,
        message,
        sender:user,
        senderRooms,
        unreadSenderMessages,
        receiver,
        receiverRooms,
        unreadReceiverMessages,
        unreadMessages,
    })
}


export const readMessage = async (req: Request, res: Response) => {
    await repository.update(req.params.id, {
        read_at:new Date(),
    })
    return res.status(200).send({
        status: true,
        message: 'INFO :: Message read successfully.'
    })
}