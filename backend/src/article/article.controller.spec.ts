import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';

process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test';

describe('ArticleController', () => {
  let controller: ArticleController;
  let service: jest.Mocked<ArticleService>;

  // sampleArticle complet pour correspondre à ArticleEntity attendu
  const sampleArticle: any = {
    id: 1,
    slug: 's',
    title: 't',
    description: 'd',
    body: 'b',
    tagList: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    favoritesCount: 0,
    authorId: 1,
    author: { id: 1, username: 'john' },
    comments: [],
  };

  const articleResponse = { article: sampleArticle };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        {
          provide: ArticleService,
          useValue: {
            createArticle: jest.fn(),
            generateArticleResponse: jest.fn(),
            getFeed: jest.fn(),
            findAll: jest.fn(),
            getSingleArticle: jest.fn(),
            deleteArticle: jest.fn(),
            updateArticle: jest.fn(),
            addToFavoriteArticle: jest.fn(),
            removeArticleFromFavorites: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ArticleController>(ArticleController);
    service = module.get(ArticleService) as any;
  });

  it('createArticle calls service and returns generated response', async () => {
    const dto: CreateArticleDto = {
      title: 't',
      description: 'd',
      body: 'b',
      tagList: ['x'],
    } as any;
    const user = { id: 1 } as any;
    service.createArticle.mockResolvedValue(sampleArticle);
    service.generateArticleResponse.mockReturnValue(articleResponse);

    const res = await controller.createArticle(user, dto);
    expect(service.createArticle).toHaveBeenCalledWith(user, dto);
    expect(service.generateArticleResponse).toHaveBeenCalledWith(sampleArticle);
    expect(res).toEqual(articleResponse);
  });

  it('getUserFeed calls service.getFeed', async () => {
    service.getFeed.mockResolvedValue({
      articles: [],
      articlesCount: 0,
    } as any);
    const res = await controller.getUserFeed(1, {});
    expect(service.getFeed).toHaveBeenCalledWith(1, {});
    expect(res).toEqual({ articles: [], articlesCount: 0 });
  });

  it('findAll delegates to service.findAll', async () => {
    service.findAll.mockResolvedValue({
      articles: [],
      articlesCount: 0,
    } as any);
    const res = await controller.findAll(0, {});
    expect(service.findAll).toHaveBeenCalledWith(0, {});
    expect(res).toEqual({ articles: [], articlesCount: 0 });
  });

  it('getArticle delegates and generates response', async () => {
    service.getSingleArticle.mockResolvedValue(sampleArticle);
    service.generateArticleResponse.mockReturnValue(articleResponse);

    const res = await controller.getArticle('s');
    expect(service.getSingleArticle).toHaveBeenCalledWith('s');
    expect(service.generateArticleResponse).toHaveBeenCalledWith(sampleArticle);
    expect(res).toEqual(articleResponse);
  });

  it('deleteArticle delegates to service.deleteArticle', async () => {
    service.deleteArticle.mockResolvedValue({ message: 'ok' } as any);
    const res = await controller.deleteArticle('s', 1);
    expect(service.deleteArticle).toHaveBeenCalledWith('s', 1);
    expect(res).toEqual({ message: 'ok' });
  });

  it('updateArticle delegates and returns generated response', async () => {
    service.updateArticle.mockResolvedValue(sampleArticle);
    service.generateArticleResponse.mockReturnValue(articleResponse);

    const dto: UpdateArticleDto = { title: 'u' } as any;
    const res = await controller.updateArticle('s', 1, dto);
    expect(service.updateArticle).toHaveBeenCalledWith('s', 1, dto);
    expect(res).toEqual(articleResponse);
  });

  it('favorite/unfavorite endpoints call service and generate response', async () => {
    service.addToFavoriteArticle.mockResolvedValue(sampleArticle);
    service.generateArticleResponse.mockReturnValue(articleResponse);
    const r1 = await controller.addToFavoriteArticle(1, 's');
    expect(service.addToFavoriteArticle).toHaveBeenCalledWith(1, 's');

    service.removeArticleFromFavorites.mockResolvedValue(sampleArticle);
    const r2 = await controller.removeArticleFromFavorites(1, 's');
    expect(service.removeArticleFromFavorites).toHaveBeenCalledWith(1, 's');
  });
});
