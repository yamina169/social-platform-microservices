import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'The unique username of the user',
  })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'securePassword123', description: 'User password' })
  @IsNotEmpty()
  readonly password: string;
}
