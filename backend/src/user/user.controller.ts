import {
  Body,
  Controller,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateUserDto } from '@/user/dto/createUser.dto';
import { UserService } from '@/user/user.service';
import { IUserResponse } from './types/userResponse.interface';
import { LoginDto } from './dto/loginUser.dto';
import { User } from './decorators/user.decorators';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';

@ApiTags('Users')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    description: 'User registration payload',
    schema: {
      example: {
        user: {
          username: 'john_doe',
          email: 'john@example.com',
          password: 'securePassword123',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<IUserResponse> {
    return await this.userService.createUser(createUserDto);
  }

  @Post('users/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    description: 'User login payload',
    schema: {
      example: {
        user: {
          email: 'john@example.com',
          password: 'securePassword123',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') loginUserDto: LoginDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.generateUserResponse(user);
  }

  @Put('user')
  @ApiOperation({ summary: 'Update user details' })
  @ApiBearerAuth()
  @ApiBody({
    description: 'Payload to update user',
    schema: {
      example: {
        user: {
          name: 'Updated Name',
          email: 'updated@example.com',
          bio: 'Updated bio content',
          image: 'https://image.url/profile.jpg',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @UseGuards(AuthGuard)
  async updateUser(
    @User('id') userId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse> {
    const updateUser = await this.userService.updateUser(userId, updateUserDto);
    return this.userService.generateUserResponse(updateUser);
  }

  @Get('user')
  @ApiOperation({ summary: 'Get current logged-in user' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User info retrieved successfully' })
  @UseGuards(AuthGuard)
  async getCurrentUser(
    @User() user,
    @User('id') userId,
  ): Promise<IUserResponse> {
    return this.userService.generateUserResponse(user);
  }
}
