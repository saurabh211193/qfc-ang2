import { Response } from '../app';

export interface LoginResponse extends Response {
  data?: UserDetails
}

export interface UserDetails {
  BucketSize: number
  CompanyId: number
  CreatedBy: number
  CreatedOn: string
  DailyLimit: number
  Email: string
  EmployeeId: string
  Grade: number
  LoginId: string
  ManagerId: number
  MobileNo: number
  Name: string
  Password: string
  UpdatedBy: number
  UpdatedOn: string
  UserId: number
  UserType: number
  isActive: number
  isAutoAllocation: number
}
