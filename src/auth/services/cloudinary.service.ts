
// auth/services/cloudinary.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { BufferedFile } from '../../common/interfaces/file.interface';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: BufferedFile): Promise<string> {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, or GIF images are allowed');
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    try {
      const result = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'user_profiles', resource_type: 'image' },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result && result.secure_url) {
              resolve(result.secure_url);
            } else {
              reject(new Error('Cloudinary upload did not return a result'));
            }
          },
        );
        uploadStream.end(file.buffer);
      });
      return result;
    } catch (error) {
      throw new BadRequestException('Failed to upload image to Cloudinary');
    }
  }
}