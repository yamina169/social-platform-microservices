import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TagEntity } from './tag.entity';

describe('TagController', () => {
  let controller: TagController;
  let service: TagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        {
          provide: TagService,
          useValue: {
            getAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TagController>(TagController);
    service = module.get<TagService>(TagService);
  });

  it('should return all tags formatted', async () => {
    const tags: TagEntity[] = [
      { id: 1, name: 'nestjs', createdAt: new Date() },
      { id: 2, name: 'typescript', createdAt: new Date() },
    ];

    jest.spyOn(service, 'getAll').mockResolvedValue(tags);

    const result = await controller.getAll();
    expect(result).toEqual({ tags: ['nestjs', 'typescript'] });
    expect(service.getAll).toHaveBeenCalled();
  });
});
