import { Joi, Segments } from 'celebrate';
import { celebrate, schemaObjectId } from './common.js';

export const schemaRouteMe = Joi.alternatives().try(
  Joi.string().equal('me'),
  schemaObjectId,
).required();
export const schemaAvatar = Joi.string().uri({ scheme: ['http', 'https'] });
export const schemaName = Joi.string().min(2).max(30);
export const schemaAbout = Joi.string().min(2).max(30);

export const schemaEmail = Joi.string().email().required();
export const schemaPassword = Joi.string().min(8).required();

export const schemaObjectRouteMe = Joi.object({
  id: schemaRouteMe,
}).required();
export const schemaObjectProfile = Joi.object({
  name: schemaName,
  about: schemaAbout,
}).required();
export const schemaObjectAvatar = Joi.object({
  avatar: schemaAvatar,
}).required();
export const schemaObjectAuth = Joi.object({
  email: schemaEmail,
  password: schemaPassword,
}).required();
export const schemaObjectUser = schemaObjectAuth
  .concat(schemaObjectProfile)
  .concat(schemaObjectAvatar);

export const segmentBodyProfile = { [Segments.BODY]: schemaObjectProfile };
export const segmentBodyAvatar = { [Segments.BODY]: schemaObjectAvatar };
export const segmentBodyAuth = { [Segments.BODY]: schemaObjectAuth };
export const segmentBodyUser = { [Segments.BODY]: schemaObjectUser };
export const segmentParamsRouteMe = { [Segments.PARAMS]: schemaObjectRouteMe };

export const celebrateBodyProfile = celebrate(segmentBodyProfile);
export const celebrateBodyAvatar = celebrate(segmentBodyAvatar);
export const celebrateBodyAuth = celebrate(segmentBodyAuth);
export const celebrateBodyUser = celebrate(segmentBodyUser);
export const celebrateParamsRouteMe = celebrate(segmentParamsRouteMe);
