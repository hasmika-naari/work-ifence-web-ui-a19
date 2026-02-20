export interface AccountDTO {
  login: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  authorities: string[];
}
