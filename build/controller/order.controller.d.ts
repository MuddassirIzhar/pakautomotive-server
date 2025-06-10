import { Request, Response } from "express";
export declare const GetOrders: (req: Request, res: Response) => Promise<void>;
export declare const ExportCsv: (req: Request, res: Response) => Promise<void>;
export declare const ChartData: (req: Request, res: Response) => Promise<void>;
