import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../generated/prisma/client';

export type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<SafeUser> {
    const exists = await this.findByEmail(createUserDto.email);
    if (exists) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.prismaService.user.findMany();
    return users.map(({ password, ...user }) => user);
  }

  async findById(id: string): Promise<SafeUser> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findById(id);
    await this.prismaService.user.delete({
      where: { id },
    });

    return { message: 'Пользователь успешно удален' };
  }
}
