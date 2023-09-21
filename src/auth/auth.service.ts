import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';
import { RegisterUserDto,CreateUserDto, UpdateAuthDto, loginDto  } from './dto';

@Injectable()
export class AuthService {

  //Injectamos el servicio que nos permite crear registros en la BD
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // console.log(createUserDto)

    try{
      // obtenemos la contraseña del user y ocupamos encriptarla antes de llegar al save()
      const { password, ...userData } = createUserDto; //desestruturamos el password y el resto de la data la guardamos en una variable usando el operador rest
      // 1- Encriptar la contraseña  
      const newUser = new this.userModel( {
        password: bcryptjs.hashSync( password, 10),
        ...userData
      });

      await newUser.save();
      const { password:_, ...user} = newUser.toJSON();

      return user;

    } catch (error) {
      // console.log(error.code)
      if( error.code === 11000 ) {
        throw new BadRequestException(`${ createUserDto.email } already exists!`)
      }
      throw new InternalServerErrorException('Something terrible happen!!')
    }
  }

  async register(registerDto: RegisterUserDto): Promise<LoginResponse> {

    const user = await this.create(registerDto);
    console.log('desde el register',user)

    return {
      user: user,
      token: this.getJwtToken({ id: user._id })
    }
  }

  async login( loginDto: loginDto ): Promise<LoginResponse> {
    // console.log({loginDto})

    const { email, password} = loginDto;
    
    //verificamos si el usuario existe por el email
    const user = await this.userModel.findOne({ email: email })
    if ( !user ){
      throw new UnauthorizedException('Not valid credentials - email');
    }

    //Con este metodo comparamos el password que nos envia el usuario con el que tenememos en la BD(user.password)
    if( !bcryptjs.compareSync( password, user.password) ){
      throw new UnauthorizedException('Not valid credentials - password');
    }

    //Para no enviar el password
    const { password:_, ...rest } = user.toJSON(); 

    return {
      user: rest,
      token: this.getJwtToken({ id: user.id })
    }
  }

  findAll(): Promise<User[]> {
    // Para traer todos los usuarios que existen en la BD
    return this.userModel.find();
  }

  async findUserById( id: string) {
    const user = await this.userModel.findById( id );
    const { password, ...rest} = user.toJSON();
    return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
