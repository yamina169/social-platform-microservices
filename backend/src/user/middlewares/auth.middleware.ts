import { AuthRequest } from '@/types/expressReequest.interface';
import { UserEntity } from '../user.entity';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UserService } from '../user.service';
import { verify } from 'jsonwebtoken';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    // Pas de token → utilisateur vide
    if (!authHeader) {
      req.user = new UserEntity();
      return next();
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET;

    // Vérification de la variable d'environnement
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    try {
      // Vérifie le token et le typecast vers un objet avec id
      const decoded = verify(token, jwtSecret) as { id: string };

      // Convertir l'id en nombre pour userService
      const userId = Number(decoded.id);
      if (isNaN(userId)) {
        req.user = new UserEntity();
        return next();
      }

      const user = await this.userService.findById(userId);

      // Si l'utilisateur n'existe pas, on renvoie un utilisateur vide
      req.user = user || new UserEntity();
      next();
    } catch (err) {
      // Si vérification échoue → utilisateur vide
      req.user = new UserEntity();
      next();
    }
  }
}
