import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../../../app';
import { UserRegistrationSchemaRepo } from './registrationSchema.repository';
import { UserTypeSchemaRepo } from '../userTypes/userTypeSchema.repository';
import { db } from '../../../db/mysql.db';

vi.mock('./registrationSchema.repository');
vi.mock('../userTypes/userTypeSchema.repository');
vi.mock('../../../db/mysql.db');

const validUser = {
  userName: 'testuser',
  email: 'test@example.com',
  phoneNumber: '1234567890',
  firstName: 'Test',
  lastName: 'User',
  password: 'password123',
  userType: 1,
  profilePicture: 'http://localhost/uploads/profile.jpg',
};
const validUserType = {
  userTypeId: 1,
  typeName: 'client',
  description: 'desc',
  is_active: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};
const validUserRecord = {
  ...validUser,
  userId: 1,
  is_active: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('User Registration API', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should register a user successfully', async () => {
    // Mock UserTypeSchemaRepo.getById to return an active userType
    vi.spyOn(UserTypeSchemaRepo, 'getById').mockResolvedValue([validUserType]);
    vi.spyOn(UserRegistrationSchemaRepo, 'getUserByEmail').mockResolvedValue(
      null
    );
    vi.spyOn(
      UserRegistrationSchemaRepo,
      'getUserByPhoneNumber'
    ).mockResolvedValue(null);
    vi.spyOn(UserRegistrationSchemaRepo, 'getUserById').mockResolvedValue(
      validUserRecord
    );
    vi.spyOn(db, 'insert').mockReturnValue({
      values: () => Promise.resolve([{ insertId: 1 }]),
    } as any);

    const res = await request(app)
      .post('/api/userRegister/register')
      .field('userName', validUser.userName)
      .field('email', validUser.email)
      .field('phoneNumber', validUser.phoneNumber)
      .field('firstName', validUser.firstName)
      .field('lastName', validUser.lastName)
      .field('password', validUser.password)
      .field('userType', validUser.userType)
      .attach('profilePicture', Buffer.from('fakeimg'), 'profile.jpg');
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('userId');
    expect(res.body.data).toHaveProperty('userType');
    expect(res.body.data.userType.typeName).toBe('client');
  });

  it('should fail if email already exists', async () => {
    // Mock UserTypeSchemaRepo.getById to return an active userType
    vi.spyOn(UserTypeSchemaRepo, 'getById').mockResolvedValue([validUserType]);
    vi.spyOn(UserRegistrationSchemaRepo, 'getUserByEmail').mockResolvedValue(
      validUserRecord
    );
    vi.spyOn(
      UserRegistrationSchemaRepo,
      'getUserByPhoneNumber'
    ).mockResolvedValue(null);
    const res = await request(app)
      .post('/api/userRegister/register')
      .send({ ...validUser });
    expect(res.status).toBe(400);
    expect(
      res.body.errors.some((e: { field: string }) => e.field === 'email')
    ).toBe(true);
  });

  it('should fail if phone number already exists', async () => {
    // Mock UserTypeSchemaRepo.getById to return an active userType
    vi.spyOn(UserTypeSchemaRepo, 'getById').mockResolvedValue([validUserType]);
    vi.spyOn(UserRegistrationSchemaRepo, 'getUserByEmail').mockResolvedValue(
      null
    );
    vi.spyOn(
      UserRegistrationSchemaRepo,
      'getUserByPhoneNumber'
    ).mockResolvedValue(validUserRecord);
    const res = await request(app)
      .post('/api/userRegister/register')
      .send({ ...validUser });
    expect(res.status).toBe(400);
    expect(
      res.body.errors.some((e: { field: string }) => e.field === 'phoneNumber')
    ).toBe(true);
  });

  it('should fail if userType does not exist', async () => {
    // Mock UserTypeSchemaRepo.getById to return empty array (no userType found)
    vi.spyOn(UserTypeSchemaRepo, 'getById').mockResolvedValue([]);
    vi.spyOn(UserRegistrationSchemaRepo, 'getUserByEmail').mockResolvedValue(
      null
    );
    vi.spyOn(
      UserRegistrationSchemaRepo,
      'getUserByPhoneNumber'
    ).mockResolvedValue(null);
    const res = await request(app)
      .post('/api/userRegister/register')
      .send({ ...validUser });
    expect(res.status).toBe(400);
    expect(
      res.body.errors.some((e: { field: string }) => e.field === 'userType')
    ).toBe(true);
  });

  it('should fail if required fields are missing', async () => {
    const res = await request(app).post('/api/userRegister/register').send({});
    expect(res.status).toBe(400);
    expect(
      res.body.errors.some((e: { field: string }) => e.field === 'userName')
    ).toBe(true);
    expect(
      res.body.errors.some((e: { field: string }) => e.field === 'email')
    ).toBe(true);
  });

  it('should fail if profilePicture is not a valid URL', async () => {
    // Mock UserTypeSchemaRepo.getById to return an active userType
    vi.spyOn(UserTypeSchemaRepo, 'getById').mockResolvedValue([validUserType]);
    vi.spyOn(UserRegistrationSchemaRepo, 'getUserByEmail').mockResolvedValue(
      null
    );
    vi.spyOn(
      UserRegistrationSchemaRepo,
      'getUserByPhoneNumber'
    ).mockResolvedValue(null);
    const res = await request(app)
      .post('/api/userRegister/register')
      .send({ ...validUser, profilePicture: 'not-a-url' });
    expect(res.status).toBe(400);
    expect(
      res.body.errors.some(
        (e: { field: string }) => e.field === 'profilePicture'
      )
    ).toBe(true);
  });

  it('should fail if password is too short', async () => {
    // Mock UserTypeSchemaRepo.getById to return an active userType
    vi.spyOn(UserTypeSchemaRepo, 'getById').mockResolvedValue([validUserType]);
    vi.spyOn(UserRegistrationSchemaRepo, 'getUserByEmail').mockResolvedValue(
      null
    );
    vi.spyOn(
      UserRegistrationSchemaRepo,
      'getUserByPhoneNumber'
    ).mockResolvedValue(null);
    const res = await request(app)
      .post('/api/userRegister/register')
      .send({ ...validUser, password: '123' });
    expect(res.status).toBe(400);
    expect(
      res.body.errors.some((e: { field: string }) => e.field === 'password')
    ).toBe(true);
  });

  it('should fail if firstName or lastName is missing', async () => {
    // Mock UserTypeSchemaRepo.getById to return an active userType
    vi.spyOn(UserTypeSchemaRepo, 'getById').mockResolvedValue([validUserType]);
    vi.spyOn(UserRegistrationSchemaRepo, 'getUserByEmail').mockResolvedValue(
      null
    );
    vi.spyOn(
      UserRegistrationSchemaRepo,
      'getUserByPhoneNumber'
    ).mockResolvedValue(null);
    let res = await request(app)
      .post('/api/userRegister/register')
      .send({ ...validUser, firstName: '' });
    expect(res.status).toBe(400);
    expect(
      res.body.errors.some((e: { field: string }) => e.field === 'firstName')
    ).toBe(true);
    res = await request(app)
      .post('/api/userRegister/register')
      .send({ ...validUser, lastName: '' });
    expect(res.status).toBe(400);
    expect(
      res.body.errors.some((e: { field: string }) => e.field === 'lastName')
    ).toBe(true);
  });

  it('should fail if file upload fails', async () => {
    // Mock UserTypeSchemaRepo.getById to return an active userType
    vi.spyOn(UserTypeSchemaRepo, 'getById').mockResolvedValue([validUserType]);
    vi.spyOn(UserRegistrationSchemaRepo, 'getUserByEmail').mockResolvedValue(
      null
    );
    vi.spyOn(
      UserRegistrationSchemaRepo,
      'getUserByPhoneNumber'
    ).mockResolvedValue(null);
    const res = await request(app)
      .post('/api/userRegister/register')
      .field('userName', validUser.userName)
      .field('email', validUser.email)
      .field('phoneNumber', validUser.phoneNumber)
      .field('firstName', validUser.firstName)
      .field('lastName', validUser.lastName)
      .field('password', validUser.password)
      .field('userType', validUser.userType);
    expect(res.status).toBe(400);
    expect(
      res.body.errors.some(
        (e: { field: string }) => e.field === 'profilePicture'
      )
    ).toBe(true);
  });

  it('should return the correct response structure', async () => {
    // Mock UserTypeSchemaRepo.getById to return an active userType
    vi.spyOn(UserTypeSchemaRepo, 'getById').mockResolvedValue([validUserType]);
    vi.spyOn(UserRegistrationSchemaRepo, 'getUserByEmail').mockResolvedValue(
      null
    );
    vi.spyOn(
      UserRegistrationSchemaRepo,
      'getUserByPhoneNumber'
    ).mockResolvedValue(null);
    vi.spyOn(UserRegistrationSchemaRepo, 'getUserById').mockResolvedValue(
      validUserRecord
    );
    vi.spyOn(db, 'insert').mockReturnValue({
      values: () => Promise.resolve([{ insertId: 1 }]),
    } as any);

    const res = await request(app)
      .post('/api/userRegister/register')
      .field('userName', validUser.userName)
      .field('email', validUser.email)
      .field('phoneNumber', validUser.phoneNumber)
      .field('firstName', validUser.firstName)
      .field('lastName', validUser.lastName)
      .field('password', validUser.password)
      .field('userType', validUser.userType)
      .attach('profilePicture', Buffer.from('fakeimg'), 'profile.jpg');
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      userId: expect.any(Number),
      userName: expect.any(String),
      profilePicture: expect.any(String),
      phoneNumber: expect.any(String),
      email: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      password: expect.any(String),
      userType: expect.any(Object),
      is_active: expect.any(Boolean),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});
