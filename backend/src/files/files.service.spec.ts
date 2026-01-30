import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { UploadFileDto } from './dto/upload-file.dto';

// Mock S3Client
jest.mock('@aws-sdk/client-s3', () => {
  const original = jest.requireActual('@aws-sdk/client-s3');
  return {
    ...original,
    S3Client: jest.fn(() => ({
      send: jest.fn(),
    })),
    PutObjectCommand: jest.fn(),
    HeadObjectCommand: jest.fn(),
    GetObjectCommand: jest.fn(),
  };
});

describe('FilesService', () => {
  let service: FilesService;
  let s3Mock: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesService],
    }).compile();

    service = module.get<FilesService>(FilesService);
    s3Mock = (service as any).s3;
  });

  it('should upload a file', async () => {
    const file = {
      originalname: 'test.txt',
      buffer: Buffer.from('hello'),
      mimetype: 'text/plain',
    } as Express.Multer.File;

    const dto: UploadFileDto = { title: 'Test File', uploadedBy: 'john' };

    s3Mock.send.mockResolvedValueOnce({});

    const result = await service.uploadFile(file, dto);

    expect(result).toEqual({
      key: 'test.txt',
      bucket: 'files',
      title: 'Test File',
      uploadedBy: 'john',
    });
    expect(s3Mock.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
  });

  it('should get file and metadata', async () => {
    const fakeStream = { pipe: jest.fn() };
    s3Mock.send
      .mockResolvedValueOnce({
        Metadata: { title: 'Test', uploadedBy: 'john' },
      }) // head
      .mockResolvedValueOnce({ Body: fakeStream, ContentType: 'text/plain' }); // get

    const result = await service.getFileAndMetadata('test.txt');

    expect(result.metadata).toEqual({ title: 'Test', uploadedBy: 'john' });
    expect(result.file).toBe(fakeStream);
    expect(result.contentType).toBe('text/plain');
    expect(s3Mock.send).toHaveBeenCalledTimes(2);
  });
});
