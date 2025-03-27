import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DietaryRestriction } from 'src/entities/dietary-restriction.entity';
import { CreateDietaryRestrictionDto } from 'src/entities/dtos/restriction.dto';
import { UserRestriction } from 'src/entities/user-restriction.entity';
import { User } from 'src/entities/user.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class RestrictionService {
  constructor(
    @InjectRepository(DietaryRestriction)
    private readonly dietaryRestrictionRepository: Repository<DietaryRestriction>,
    @InjectRepository(UserRestriction)
    private readonly userRestrictionRepository: Repository<UserRestriction>,
  ) {}

  /**
   * 식이 제한을 생성합니다.
   * @param dto
   * @returns
   * @description 식이 제한을 생성합니다.
   */
  createDietaryRestriction(dto: CreateDietaryRestrictionDto): Promise<DietaryRestriction> {
    return this.dietaryRestrictionRepository.save(this.dietaryRestrictionRepository.create(dto));
  }

  async getDietaryRestrictionByIds(dietary_restrictions: string[]): Promise<DietaryRestriction[]> {
    const dietaryRestrictions = await this.dietaryRestrictionRepository.findBy({
      uid: In(dietary_restrictions),
    });

    if (dietaryRestrictions.length !== dietary_restrictions.length) {
      throw new NotFoundException('Some dietary restrictions are not found');
    }

    return dietaryRestrictions;
  }

  async getDietaryRestrictions(): Promise<DietaryRestriction[]> {
    return this.dietaryRestrictionRepository.find();
  }

  /**
   * 사용자의 식이 제한을 생성합니다.
   * @param user
   * @param dietary_restrictions
   * @returns
   */
  async createUserRestriction(user: User, dietary_restrictions: string[]): Promise<UserRestriction[]> {
    const dietaryRestrictions = await this.getDietaryRestrictionByIds(dietary_restrictions);
    return dietaryRestrictions.map((dietaryRestriction) =>
      this.userRestrictionRepository.create({
        user,
        dietaryRestriction,
      }),
    );
  }
}
