import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { ArticleEntity } from './article.entity';
import { UserEntity } from '../user/user.entity';
import { FollowEntity } from '@/profile/types/follow.entity';

describe('ArticleService', () => {
  let service: ArticleService;

  const mockArticleRepository = {
    create: jest.fn().mockImplementation((dto) => ({ ...dto })),
    save: jest.fn().mockImplementation(async (entity) => ({
      id: Math.floor(Math.random() * 1000),
      slug: entity.title?.toLowerCase().replace(/ /g, '-') || 'slug',
      author: entity.author,
      favoritesCount: entity.favoritesCount || 0,
      tagList: entity.tagList || [],
      description: entity.description || '',
      body: entity.body || '',
      title: entity.title || '',
      authorId: entity.author?.id || 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockFollowRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getRepositoryToken(ArticleEntity),
          useValue: mockArticleRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(FollowEntity),
          useValue: mockFollowRepository,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createArticle', () => {
    it('creates article and sets slug + author', async () => {
      const user: UserEntity = {
        id: 1,
        username: 'john',
        email: 'john@example.com',
      } as UserEntity;
      const dto = { title: 'New Article', description: 'desc', body: 'body' };

      const result = await service.createArticle(user, dto as any);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.slug).toContain('new-article');
      expect(result.author).toBe(user);
      expect(result.favoritesCount).toBe(0);
    });
  });

  describe('removeArticleFromFavorites', () => {
    it('removes article from favorites', async () => {
      const article: ArticleEntity = {
        slug: 'my-article',
        favoritesCount: 1,
      } as ArticleEntity;
      const user: UserEntity = { id: 1, favorites: [article] } as UserEntity;

      mockArticleRepository.findOne.mockResolvedValue(article);
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.removeArticleFromFavorites(
        user.id,
        article.slug,
      );

      expect(result.favoritesCount).toBe(0);
      expect(user.favorites.length).toBe(0);
    });
  });

  describe('getSingleArticle', () => {
    it('returns the article by slug', async () => {
      const article: ArticleEntity = { slug: 'my-article' } as ArticleEntity;
      mockArticleRepository.findOne.mockResolvedValue(article);

      const result = await service.getSingleArticle(article.slug);

      expect(result).toBe(article);
    });
  });
});
