import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { Id } from 'objection';
import { Bag, Cuboid } from '../models';

export const list = async (req: Request, res: Response): Promise<Response> => {
  const ids = req.query.ids as Id[];
  const cuboids = await Cuboid.query().findByIds(ids).withGraphFetched('bag');

  return res.status(200).json(cuboids);
};

export const get = async (req: Request, res: Response): Promise<Response> =>
  res.sendStatus(200);

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { width, height, depth, bagId } = req.body;

  const cuboid = await Cuboid.query().insert({
    width,
    height,
    depth,
    bagId,
  });

  return res.status(HttpStatus.CREATED).json(cuboid);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { width, height, depth } = req.body;
  const volume = width * height * depth;
  // eslint-disable-next-line fp/no-let
  let cuboid = (await Cuboid.query().findById(req.params.id)) as Cuboid;

  const bagId = cuboid.bagId as Id;
  const bag = (await Bag.query().findById(bagId)) as Bag;
  if (volume > bag.volume) {
    return res.sendStatus(HttpStatus.UNPROCESSABLE_ENTITY);
  }

  cuboid = await Cuboid.query().patchAndFetchById(req.params.id, {
    width,
    height,
    depth,
  });

  return res.status(HttpStatus.OK).json(cuboid);
};

export const deleteCuboid = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const cuboid = await Cuboid.query().deleteById(req.params.id);
  if (!cuboid) {
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  return res.sendStatus(HttpStatus.OK);
};
