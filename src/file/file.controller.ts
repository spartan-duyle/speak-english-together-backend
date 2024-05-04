import { FileService } from './file.service';
import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserGuard } from '../authentication/guard/auth.guard';
import { VerifiyGuard } from '../authentication/guard/verify.guard';
import { FileUploadDto } from './dto/fileUpload.dto';
import { UploadFileResponse } from './response/uploadFile.response';

@Controller('file')
@ApiTags('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiResponse({
    status: 200,
    description: 'File uploaded successfully',
    type: UploadFileResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // limit file size to 5MB
    }),
  )
  @UseGuards(UserGuard, VerifiyGuard)
  @UseGuards(UserGuard, VerifiyGuard)
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.fileService.uploadImage(file);
    return { imageUrl };
  }
}
