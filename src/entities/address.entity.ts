import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Address extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  roadAddress: string; // 도로명 주소

  @Column({ type: 'varchar', length: 255, nullable: true })
  roadAddressFull: string; // 도로명 주소 전체

  @Column({ type: 'varchar', length: 255, nullable: true })
  detailAddress: string; // 고객 입력 상세 주소

  @Column({ type: 'varchar', length: 255, nullable: true })
  referenceAddress: string; // 참고 주소

  @Column({ type: 'varchar', length: 255, nullable: true })
  roadAddressEnglish: string; // 영문 도로명 주소

  @Column({ type: 'varchar', length: 255 })
  jibunAddress: string; // 지번 주소

  @Column({ type: 'varchar', length: 20 })
  postalCode: string; // 우편번호

  @ManyToOne(() => User, (user) => user.addresses)
  @JoinColumn()
  user: User;
}
