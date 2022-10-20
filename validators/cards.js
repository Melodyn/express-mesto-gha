import { Joi, Segments } from 'celebrate';
import { celebrate, schemaObjectId } from './common.js';

export const schemaRouteId = schemaObjectId;
export const schemaName = Joi.string().min(2).max(30).required();
export const schemaLink = Joi.string().uri({ scheme: ['http', 'https'] }).required();

export const schemaObjectRouteId = Joi.object({
  id: schemaRouteId,
}).required();
export const schemaObjectCard = Joi.object({
  name: schemaName,
  link: schemaLink,
}).required();

export const segmentBodyCard = { [Segments.BODY]: schemaObjectCard };
export const segmentParamsRouteMe = { [Segments.PARAMS]: schemaObjectRouteId };

export const celebrateBodyCard = celebrate(segmentBodyCard);
export const celebrateParamsRouteId = celebrate(segmentParamsRouteMe);
