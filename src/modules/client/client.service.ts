import { ClientSchemaRepo } from './clientSchema.repository';
import { ICreateClientDto } from './validators/client.dtos';

export class ClientService {
  static async createClientRecord(
    clientData: ICreateClientDto,
    userId: number
  ) {
    const insertClient = await ClientSchemaRepo.createClient({
      ...clientData,
      userId,
    });
    return insertClient;
  }
}
