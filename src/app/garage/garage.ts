import { Response } from '../app';

export interface CityResponse extends Response {

}

export interface Cities {
  Name: string;
}

export interface pagination {
  currentPage: number;
  nextPage: number;
  prevPage: number;
  totalPages: number;
}

export interface Make {
  AliasMakeName: string;
  MakeId: number;
  MakeName: string;
}


