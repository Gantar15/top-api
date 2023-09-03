import { InjectModel } from '@nestjs/mongoose';
import { AuthDto } from './dto/auth.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserModel } from './user.model';
import { Model } from 'mongoose';
import { genSalt, hash, compare } from 'bcrypt';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto) {
    const salt = await genSalt(13);
    const newUser = new this.userModel({
      email: dto.login,
      passwordHash: await hash(dto.password, salt),
    });
    return newUser.save();
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'email'>> {
    const userCandidate = await this.findUser(email);
    if (!userCandidate) throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    const isPusswordCorrect = await compare(
      password,
      userCandidate.passwordHash,
    );
    if (!isPusswordCorrect)
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    return { email: userCandidate.email };
  }

  async login(email: string) {
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
