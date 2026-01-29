import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsString()
  readonly name: string;

  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'Email address of the user',
  })
  @IsString()
  readonly email: string;

  @ApiPropertyOptional({
    example: 'I love coding!',
    description: 'Short bio of the user',
  })
  @IsString()
  readonly bio: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Profile image URL',
  })
  @IsString()
  readonly image: string;
}
