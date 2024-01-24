import prisma from '../db';
import { HttpError } from '../utils/error';
import { IGetShelterByIdPayload } from './types';

const getShelterById = async (payload: IGetShelterByIdPayload) => {
  const { id } = payload;

  const shelter = await prisma.shelter.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!shelter) {
    throw new HttpError(404, 'Shelter cannot be found');
  }

  return shelter;
};

export default getShelterById;
