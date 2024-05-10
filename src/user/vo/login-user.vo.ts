interface UserInfo {
  id: number;

  username: string;

  nickName: string;

  email: string;

  avatar: string;

  phoneNumber: string;

  isFrozen: boolean;

  createTime: number;

  roles: string[];
}
export class LoginUserVo {
  userInfo: UserInfo;

  accessToken: string;

  refreshToken: string;
}
