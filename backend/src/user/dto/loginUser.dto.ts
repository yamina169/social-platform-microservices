import { IsEmail, IsNotEmpty, IsString, isString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'securePassword123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
