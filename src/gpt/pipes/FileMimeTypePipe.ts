import {
    PipeTransform,
    Injectable,
    BadRequestException,
    ArgumentMetadata,
} from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class FileMimeTypePipe implements PipeTransform {
    constructor(private readonly allowedMimeTypes: string[]) { }

    transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
        if (!value || !value.mimetype) {
            throw new BadRequestException('No se recibió ningún archivo');
        }

        if (!this.allowedMimeTypes.includes(value.mimetype)) {
            throw new BadRequestException(
                `Tipo de archivo no permitido: ${value.mimetype}. Tipos válidos: ${this.allowedMimeTypes.join(', ')}`
            );
        }

        return value;
    }
}
