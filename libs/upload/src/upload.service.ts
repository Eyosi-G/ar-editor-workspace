import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class UploadService {
    abstract uploadFile(key: string, stream: any, contentType?: string ): Promise<void>;
    abstract getUploadURL(key: string): string;
    abstract delete(url: string)
}