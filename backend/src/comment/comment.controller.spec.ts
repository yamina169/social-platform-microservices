import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { UserEntity } from '../user/user.entity';
import { AuthGuard } from '../user/guards/auth.guard';

describe('CommentController', () => {
  let controller: CommentController;
  let service: CommentService;

  const mockCommentService = {
    getComments: jest.fn(),
    createComment: jest.fn(),
    deleteComment: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [{ provide: CommentService, useValue: mockCommentService }],
    })
      // Mock AuthGuard globalement
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<CommentController>(CommentController);
    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getComments', () => {
    it('should return all comments for an article', async () => {
      const slug = 'my-article';
      const comments = [{ id: 1, body: 'test comment' }];
      mockCommentService.getComments.mockResolvedValue({ comments });

      const result = await controller.getComments(slug);
      expect(result.comments).toEqual(comments);
      expect(mockCommentService.getComments).toHaveBeenCalledWith(slug);
    });
  });

  describe('createComment', () => {
    it('should create a comment', async () => {
      const slug = 'my-article';
      const user: UserEntity = { id: 1, username: 'john' } as UserEntity;
      const dto: CreateCommentDto = { body: 'Hello comment' };
      const savedComment = { id: 1, body: 'Hello comment', author: user };

      mockCommentService.createComment.mockResolvedValue({
        comment: savedComment,
      });

      const result = await controller.createComment(user, slug, dto);
      expect(result.comment).toEqual(savedComment);
      expect(mockCommentService.createComment).toHaveBeenCalledWith(
        user,
        slug,
        dto,
      );
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      const slug = 'my-article';
      const commentId = 1;
      const currentUserId = 1;

      mockCommentService.deleteComment.mockResolvedValue(undefined);

      const result = await controller.deleteComment(
        currentUserId,
        slug,
        commentId,
      );
      expect(result).toBeUndefined();
      expect(mockCommentService.deleteComment).toHaveBeenCalledWith(
        slug,
        commentId,
        currentUserId,
      );
    });
  });
});
