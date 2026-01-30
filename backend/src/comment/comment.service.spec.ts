import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { CommentEntity } from './comment.entity';
import { ArticleEntity } from '../article/article.entity';
import { UserEntity } from '../user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';

describe('CommentService', () => {
  let service: CommentService;

  const mockCommentRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockArticleRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: mockCommentRepository,
        },
        {
          provide: getRepositoryToken(ArticleEntity),
          useValue: mockArticleRepository,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createComment', () => {
    it('should create a comment', async () => {
      const user: UserEntity = { id: 1, username: 'john' } as UserEntity;
      const article: ArticleEntity = {
        id: 10,
        slug: 'my-article',
      } as ArticleEntity;
      const createCommentDto = { body: 'Test comment' };

      mockArticleRepository.findOne.mockResolvedValue(article);
      mockCommentRepository.save.mockImplementation((comment) =>
        Promise.resolve({ ...comment, id: 1 }),
      );

      const result = await service.createComment(
        user,
        'my-article',
        createCommentDto as any,
      );

      expect(result.comment.body).toBe('Test comment');
      expect(result.comment.author).toBe(user);
      expect(result.comment.article).toBe(article);
    });

    it('should throw if article not found', async () => {
      mockArticleRepository.findOne.mockResolvedValue(null);
      await expect(
        service.createComment({} as any, 'unknown', { body: 'hi' } as any),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getComments', () => {
    it('should return comments for an article', async () => {
      const article: ArticleEntity = {
        id: 10,
        slug: 'my-article',
      } as ArticleEntity;
      const comments: CommentEntity[] = [
        { id: 1, body: 'test comment', article } as CommentEntity,
      ];

      mockArticleRepository.findOne.mockResolvedValue(article);
      mockCommentRepository.find.mockResolvedValue(comments);

      const result = await service.getComments('my-article');
      expect(result.comments.length).toBe(1);
      expect(result.comments[0].body).toBe('test comment');
    });

    it('should throw if article not found', async () => {
      mockArticleRepository.findOne.mockResolvedValue(null);
      await expect(service.getComments('unknown')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment if user is author', async () => {
      const user: UserEntity = { id: 1 } as UserEntity;
      const article: ArticleEntity = { id: 10, slug: 'slug' } as ArticleEntity;
      const comment: CommentEntity = {
        id: 5,
        author: user,
        article,
      } as CommentEntity;

      mockArticleRepository.findOne.mockResolvedValue(article);
      mockCommentRepository.findOne.mockResolvedValue(comment);
      mockCommentRepository.remove.mockResolvedValue(comment);

      await service.deleteComment('slug', 5, 1);
      expect(mockCommentRepository.remove).toHaveBeenCalledWith(comment);
    });

    it('should throw if user is not author', async () => {
      const user: UserEntity = { id: 1 } as UserEntity;
      const article: ArticleEntity = { id: 10, slug: 'slug' } as ArticleEntity;
      const comment: CommentEntity = {
        id: 5,
        author: { id: 2 },
        article,
      } as CommentEntity;

      mockArticleRepository.findOne.mockResolvedValue(article);
      mockCommentRepository.findOne.mockResolvedValue(comment);

      await expect(service.deleteComment('slug', 5, 1)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw if comment not found', async () => {
      const article: ArticleEntity = { id: 10, slug: 'slug' } as ArticleEntity;
      mockArticleRepository.findOne.mockResolvedValue(article);
      mockCommentRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteComment('slug', 99, 1)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw if article not found', async () => {
      mockArticleRepository.findOne.mockResolvedValue(null);
      await expect(service.deleteComment('slug', 1, 1)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
