import { PoolConnection } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { User } from '../types/auth';

export class UserModel {
  static async findByEmail(connection: PoolConnection, email: string): Promise<User | null> {
    try {
      const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
      const users = rows as User[];
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw new Error('Database error while finding user');
    }
  }

  static async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
