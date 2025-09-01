import { authenticateToken, validateBody } from '@middleware-core';
import { Router } from 'express';
import { requireAbility } from 'middlewares/ability.middleware';
import { Action, Subject } from 'modules/auth/casl/casl.enum';
import { ClientController } from 'modules/client/client.controller';
import {
  companyLogoPreValidator,
  saveBufferedLogo,
  uploadClientLogo,
} from 'modules/client/middlewares/clientMulter.middleware';
import { clientCreateDto } from 'modules/client/validators/client.dtos';

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

export default router;
