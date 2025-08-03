import {
    Injectable,
    PipeTransform,
    BadRequestException,
} from '@nestjs/common';

@Injectable()
export class CustomAudioFileValidator implements PipeTransform {
    private allowedTypes = [
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/mp4',
        'audio/x-m4a',
    ];

    transform(file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        if (!this.allowedTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                `Unsupported file type: ${file.mimetype}`,
            );
        }

        return file;
    }
}
