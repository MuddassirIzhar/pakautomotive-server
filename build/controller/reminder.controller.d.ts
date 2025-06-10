import { Request, Response } from "express";
export declare const GetReminders: (req: Request, res: Response) => Promise<void>;
export declare const GetMyReminders: (req: Request, res: Response) => Promise<void>;
export declare const GetReminder: (req: Request, res: Response) => Promise<void>;
export declare const CreateReminder: (req: Request, res: Response) => Promise<void>;
export declare const UpdateReminder: (req: Request, res: Response) => Promise<void>;
export declare const DeleteReminder: (req: Request, res: Response) => Promise<void>;
