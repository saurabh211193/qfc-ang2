export interface Lead { }

export interface statusCount {
  StatusId: number;
  StatusName: string;
  Total: string;
}

export interface customerData {
  CustomerAddress: string;
  CustomerAlternateMobileNo: number;
  CustomerEmail: string;
  CustomerId: number;
  CustomerMobileNo: number;
  CustomerName: string;
}

export interface leadData {
  FollowUpDateTime: string;
  FollowUpWith: string;
  FuelType: string;
  Latitude: string;
  LeadFollowUpId: number;
  LeadId: number;
  LeadSource: string;
  Location: string;
  Longitude: string;
  MakeId: number;
  MakeName: string;
  ModelId: number;
  ModelName: string;
  RequestType: number;
  RegistrationNo: string;
  ReachOutDate: any;
  ExitPointURL: string;
  Utm_Source: any;
  CurrentKM: any;
  LastKM: any;
  ProductId: any;
  ProductName: any;
  PBClaimId: any;
  InvoiceUrl: any;
}

export interface bookingData {
  BookingDetailId: any;
  BookingCreatedOn: string;
  BookingPickupDate: string;
  BookingPickupTime: string;
  TotalCost: any;
  ServiceOn: string;
  IsPickupRequied: any;
}

export interface bookedGarageData {
  GarageAddress: string;
  GarageAlternateNo: number;
  GarageContactPersonMobileNo: number;
  GarageContactPersonName: string;
  GarageEmail: string;
  GarageId: number;
  GarageName: string;
  GaragePincode: number;
  GarageType: number;
}
