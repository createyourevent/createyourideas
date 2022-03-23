export interface IUser {
  id?: string;
  login?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phone?: string;
  iban?: string;
  bankname?: string;
  bankaddress?: string;
  email?: string;
  loggedIn?: boolean;
  points?: number;
  agb?: boolean;
}

export class User implements IUser {
  constructor(public id: string, public login: string, public firstName: string, public lastName: string,  public address: string, public phone: string, public iban: string, public bankname: string, public bankaddress: string, public email: string, public loggedIn: boolean, public points: number, public agb: boolean) {}
}

export function getUserIdentifier(user: IUser): string | undefined {
  return user.id;
}
