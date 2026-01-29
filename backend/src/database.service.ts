import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import config from './ormconfig';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private dataSource = new DataSource(config);

  async onModuleInit() {
    try {
      await this.dataSource.initialize();
      console.log('Database connection successful');
    } catch (error) {
      console.error('Database connection failed', error);
    }
  }
}

/*-- Grants basic schema permissions
GRANT USAGE, CREATE ON SCHEMA public TO devuser;

-- Grants full access to existing tables, sequences, and functions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO devuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO devuser;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO devuser;

-- Sets default permissions for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO devuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO devuser;
*/
