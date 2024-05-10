import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'role',
  comment: '角色信息表',
})
export class Role {
  @PrimaryGeneratedColumn({
    name: 'role_id',
    type: 'int',
    comment: '角色ID',
  })
  id: number;

  @Column({
    name: 'role_name',
    type: 'varchar',
    length: 30,
    comment: '角色名称',
  })
  roleName: string;

  @Column({
    type: 'varchar',
    name: 'role_key',
    length: 100,
    comment: '角色权限字符串',
  })
  roleKey: string;

  @Column({
    name: 'role_sort',
    type: 'int',
    default: 0,
    comment: '显示顺序',
  })
  roleSort: number;

  @Column({
    type: 'boolean',
    name: 'menu_check_strictly',
    default: false,
    comment: '菜单树选择项是否关联显示',
  })
  menuCheckStrictly: boolean;

  @Column({
    type: 'boolean',
    name: 'dept_check_strictly',
    default: false,
    comment: '部门树选择项是否关联显示',
  })
  deptCheckStrictly: boolean;
}
