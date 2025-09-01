import { db } from 'db/mysql.db';
import { IClientResponseDto, ICreateClientDto } from './validators/client.dtos';
import { client } from '@schema-models';
import { and, eq, ne } from 'drizzle-orm';

export class ClientSchemaRepo {
  static async isGstNumberExistAcrossClients(
    gstNumber: ICreateClientDto['gstNumber'],
    excludeClient?: IClientResponseDto['clientId']
  ) {
    const existingClient = await db
      .select()
      .from(client)
      .where(
        excludeClient
          ? and(
              eq(client.gstNumber, gstNumber),
              ne(client.clientId, excludeClient)
            )
          : eq(client.gstNumber, gstNumber)
      );
    return existingClient.length > 0;
  }
  static async validateUserClientUniqueness(
    userId: number,
    excludeClientId?: number
  ) {
    const existingClient = await db
      .select()
      .from(client)
      .where(
        excludeClientId
          ? and(eq(client.userId, userId), ne(client.clientId, excludeClientId))
          : eq(client.userId, userId)
      );
    return existingClient.length > 1;
  }
  static async validateFirmGSTCombination(
    billingFirmName: string,
    gstNumber: string,
    excludeClientId?: number
  ) {
    const existingClient = await db
      .select()
      .from(client)
      .where(
        excludeClientId
          ? and(
              eq(client.billingFirmName, billingFirmName),
              eq(client.gstNumber, gstNumber),
              ne(client.clientId, excludeClientId)
            )
          : and(
              eq(client.billingFirmName, billingFirmName),
              eq(client.gstNumber, gstNumber)
            )
      );
    return existingClient.length > 0;
  }
  static async validateMobileUniqueness(
    officeMobileNumber: IClientResponseDto['officeMobileNumber'],
    excludeClientId?: IClientResponseDto['clientId']
  ) {
    const existingClient = await db
      .select()
      .from(client)
      .where(
        excludeClientId
          ? and(
              eq(client.officeMobileNumber, officeMobileNumber),
              ne(client.clientId, excludeClientId)
            )
          : eq(client.officeMobileNumber, officeMobileNumber)
      );
    return existingClient.length > 0;
  }
  static async createClient(clientData: ICreateClientDto & { userId: number }) {
    const [insertingClient] = await db.insert(client).values({
      userId: clientData.userId,
      gstNumber: clientData.gstNumber,
      billingFirmName: clientData.billingFirmName,
      officeMobileNumber: clientData.officeMobileNumber,
      companyLogo: clientData.companyLogo,
    });
    const insertedId = insertingClient.insertId;
    const [newClient] = await db
      .select()
      .from(client)
      .where(eq(client.clientId, insertedId));

    return newClient;
  }
}
