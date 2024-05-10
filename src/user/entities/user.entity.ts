import { Exclude } from 'class-transformer';
import { Role } from 'src/role/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'user',
  comment: '用户信息表',
})
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
    comment: '用户ID',
  })
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
  })
  username: string; // 用户名

  @Exclude()
  @Column({
    length: 50,
    comment: '密码',
  })
  password: string; // 密码

  @Column({
    name: 'nick_name',
    length: 50,
    comment: '昵称',
  })
  nickName: string; // 昵称

  @Column({
    length: 50,
    comment: '邮箱',
  })
  email: string; // 邮箱

  @Column({
    length: 20,
    comment: '手机号',
    nullable: true,
    name: 'phone_number',
  })
  phoneNumber: string; // 手机号

  @Column({
    length: 100,
    comment: '头像地址',
    nullable: true,
  })
  avatar: string; // 头像地址

  @Column({
    name: 'is_frozen',
    comment: '是否被冻结',
    default: false,
  })
  isFrozen: boolean; // 是否被冻结

  @Column({
    name: 'user_type',
    type: 'varchar',
    comment: '用户类型',
    length: 2,
    default: '00', // 00 系统用户  01 管理员 02 普通用户
  })
  userType: string; // 用户类型

  @Column({
    type: 'varchar',
    name: 'login_ip',
    length: 128,
    default: '',
    comment: '最后登录IP',
  })
  loginIp: string;

  @Column({
    type: 'timestamp',
    name: 'login_date',
    comment: '最后登录时间',
    nullable: true,
  })
  loginDate: Date;

  @CreateDateColumn({
    name: 'create_time',
  })
  createTime: Date;

  @UpdateDateColumn({
    name: 'updateTime',
  })
  updateTime: Date;

  // 用户-角色 中间表 user_roles
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
  })
  roles: Role[];
}
