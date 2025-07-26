import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserTypeService } from './userType.service';
import { UserTypeSchemaRepo } from './userTypeSchema.repository';
import { db } from '../../../db/mysql.db';
import { ApiError } from '@utils-core';

vi.mock('./userTypeSchema.repository');
vi.mock('../../../db/mysql.db');

const mockUserTypeActive = {
  userTypeId: 1,
  typeName: 'admin',
  description: 'desc',
  is_active: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockUserTypeInactive = {
  userTypeId: 2,
  typeName: 'admin',
  description: 'desc',
  is_active: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

function mockDbInsertReturn(insertId: number) {
  vi.spyOn(db, 'insert').mockReturnValue({
    values: () => Promise.resolve([{ insertId }]),
  } as any);
}

function mockDbUpdateReturn(affectedRows: number) {
  vi.spyOn(db, 'update').mockReturnValue({
    set: () => ({ where: () => Promise.resolve([{ affectedRows }]) }),
  } as any);
}

function mockDbDeleteReturn(affectedRows: number) {
  vi.spyOn(db, 'delete').mockReturnValue({
    where: () => Promise.resolve([{ affectedRows }]),
  } as any);
}

describe('UserTypeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('should create a new userType if no duplicate exists', async () => {
    // Mock to return no existing userTypes
    vi.spyOn(db, 'select').mockReturnValue({
      from: () => ({ where: () => Promise.resolve([]) }),
    } as any);
    mockDbInsertReturn(3);
    vi.spyOn(UserTypeSchemaRepo, 'getById').mockResolvedValue([
      { ...mockUserTypeActive, userTypeId: 3 },
    ]);

    const result = await UserTypeService.create({
      typeName: 'admin',
      description: 'desc',
    });
    expect(result).toBeDefined();
    expect(result[0]?.userTypeId).toBe(3);
    expect(result[0]?.typeName).toBe('admin');
  });

  it('should not allow duplicate active userType', async () => {
    // Mock to return existing active userType
    vi.spyOn(db, 'select').mockReturnValue({
      from: () => ({ where: () => Promise.resolve([mockUserTypeActive]) }),
    } as any);

    await expect(
      UserTypeService.create({ typeName: 'admin', description: 'desc' })
    ).rejects.toThrow(ApiError);
  });

  it('should reactivate an inactive userType if exists', async () => {
    // First call: no active, second call: one inactive
    let callCount = 0;
    vi.spyOn(db, 'select').mockReturnValue({
      from: () => ({
        where: () => {
          callCount++;
          if (callCount === 1) return Promise.resolve([]); // No active
          if (callCount === 2) return Promise.resolve([mockUserTypeInactive]); // Inactive exists
          return Promise.resolve([
            { ...mockUserTypeInactive, is_active: true },
          ]); // After update
        },
      }),
    } as any);
    vi.spyOn(db, 'update').mockReturnValue({
      set: () => ({ where: () => Promise.resolve([{ affectedRows: 1 }]) }),
    } as any);
    vi.spyOn(UserTypeSchemaRepo, 'getById').mockResolvedValue([
      { ...mockUserTypeInactive, is_active: true },
    ]);

    const result = await UserTypeService.create({
      typeName: 'admin',
      description: 'desc',
    });
    expect(result[0]!.is_active).toBe(true);
  });

  it('should update userType and prevent duplicate name', async () => {
    // Test successful update - no duplicate
    vi.spyOn(db, 'select').mockReturnValue({
      from: () => ({ where: () => Promise.resolve([]) }),
    } as any);
    mockDbUpdateReturn(1);
    vi.spyOn(UserTypeSchemaRepo, 'getById').mockResolvedValue([
      { ...mockUserTypeActive, typeName: 'newname' },
    ]);

    const result = await UserTypeService.updateUserType(1, {
      typeName: 'newname',
    });
    expect(result!.typeName).toBe('newname');
  });

  it('should prevent duplicate name during update', async () => {
    // Test duplicate name during update
    vi.spyOn(db, 'select').mockReturnValue({
      from: () => ({ where: () => Promise.resolve([mockUserTypeActive]) }),
    } as any);

    await expect(
      UserTypeService.updateUserType(2, { typeName: 'admin' })
    ).rejects.toThrow(ApiError);
  });

  it('should soft delete (toggle is_active)', async () => {
    // Mock getById to return active, then after update return inactive
    vi.spyOn(UserTypeSchemaRepo, 'getById').mockResolvedValue([
      mockUserTypeActive,
    ]);
    vi.spyOn(db, 'update').mockReturnValue({
      set: () => ({
        where: () => Promise.resolve([{ affectedRows: 1 }]),
      }),
    } as any);
    vi.spyOn(UserTypeSchemaRepo, 'getById')
      .mockResolvedValueOnce([mockUserTypeActive])
      .mockResolvedValueOnce([{ ...mockUserTypeActive, is_active: false }]);

    const result = await UserTypeService.softDeleteUserType(1);
    expect(result[0]!.is_active).toBe(false);
  });

  it('should throw on soft delete if not found', async () => {
    vi.spyOn(UserTypeSchemaRepo, 'getById').mockResolvedValue([]);
    await expect(UserTypeService.softDeleteUserType(99)).rejects.toThrow(
      ApiError
    );
  });

  it('should hard delete userType', async () => {
    vi.spyOn(UserTypeSchemaRepo, 'getById').mockResolvedValue([
      mockUserTypeActive,
    ]);
    mockDbDeleteReturn(1);
    const result = await UserTypeService.hardDeleteUserType(1);
    expect(result.deleted).toBe(true);
  });

  it('should throw on hard delete if not found', async () => {
    vi.spyOn(UserTypeSchemaRepo, 'getById').mockResolvedValue([]);
    await expect(UserTypeService.hardDeleteUserType(99)).rejects.toThrow(
      ApiError
    );
  });
});
