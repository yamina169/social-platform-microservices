import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { UploadFileDto } from './dto/upload-file.dto';

describe('FilesController', () => {
  let controller: FilesController;
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: {
            uploadFile: jest.fn(),
            getFileAndMetadata: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
    service = module.get<FilesService>(FilesService);
  });

  it('should upload a file', async () => {
    const file = {
      originalname: 'test.txt',
      buffer: Buffer.from('hi'),
      mimetype: 'text/plain',
    } as Express.Multer.File;
    const dto: UploadFileDto = { title: 'Test', uploadedBy: 'john' };
    const expected = {
      key: 'test.txt',
      bucket: 'files',
      title: 'Test',
      uploadedBy: 'john',
    };

    jest.spyOn(service, 'uploadFile').mockResolvedValue(expected);

    const result = await controller.uploadFile(file, dto);
    expect(result).toEqual(expected);
    expect(service.uploadFile).toHaveBeenCalledWith(file, dto);
  });
});
