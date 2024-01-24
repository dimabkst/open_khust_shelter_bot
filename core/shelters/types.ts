import { IPaginationPayload } from '../utils/types';

export interface IGetShelterByIdPayload {
  id: string;
}

export interface IGetSheltersPayload extends IPaginationPayload {}
