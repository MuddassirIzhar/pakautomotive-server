import express, { Request, Response } from "express";
export declare const Rooms: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>>>;
export declare const MyRooms: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>>>;
export declare const GetRoom: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>>>;
export declare const CreateRoom: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>>>;
export declare const DeleteRoom: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>>>;
