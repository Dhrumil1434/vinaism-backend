import {
  authenticateToken,
  validateBody,
  validateQuery,
} from '@middleware-core';
import { Router } from 'express';
import { requireAbility } from 'middlewares/ability.middleware';
import { Action, Subject } from 'modules/auth/casl/casl.enum';
import { ClientController } from 'modules/client/client.controller';
import {
  companyLogoPreValidator,
  saveBufferedLogo,
  uploadClientLogo,
} from 'modules/client/middlewares/clientMulter.middleware';
import {
  clientCreateDto,
  ClientFilterDto,
} from 'modules/client/validators/client.dtos';

const router = Router();

router.post(
  '/create',
  authenticateToken,
  requireAbility(Action.CREATE, Subject.CLIENT),
  uploadClientLogo,
  companyLogoPreValidator,
  validateBody(clientCreateDto),
  saveBufferedLogo,
  ClientController.createClientRecord
);

router.get(
  '/',
  authenticateToken,
  requireAbility(Action.READ, Subject.CLIENT),
  validateQuery(ClientFilterDto),
  ClientController.getPaginatedClient
);

export default router;
