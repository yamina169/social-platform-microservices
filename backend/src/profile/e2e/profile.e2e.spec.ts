// src/profile/e2e/profile.e2e.spec.ts
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
let jwtToken: string;

// Users
const mainUser = {
  username: 'jbing',
  email: 'jbing@example.com',
  password: 'password',
};

const targetUser = {
  username: 'ahmed',
  email: 'ahmed@example.com',
  password: 'password',
};

test.describe('Profile E2E Tests', () => {
  // 1️⃣ Register main user if not exists
  test('Register main user if not exists', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/users`, {
      data: { user: mainUser },
    });
    expect([201, 422]).toContain(response.status()); // 201 created, 422 already exists
  });

  // 2️⃣ Login main user to get JWT
  test('Login main user', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/users/login`, {
      data: { user: { email: mainUser.email, password: mainUser.password } },
    });
    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body.user.token).toBeDefined();
    jwtToken = body.user.token;
  });

  // 3️⃣ Register target user (ahmed) if not exists
  test('Register target user if not exists', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/users`, {
      data: { user: targetUser },
    });
    expect([201, 422]).toContain(response.status());
  });

  // 4️⃣ Get target user profile
  test('Get profile of ahmed', async ({ request }) => {
    if (!jwtToken) throw new Error('JWT token not set from login');

    const response = await request.get(
      `${BASE_URL}/profiles/${targetUser.username}`,
      {
        headers: { Authorization: `Bearer ${jwtToken}` },
      },
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.profile.username).toBe(targetUser.username);
  });

  // 5️⃣ Follow target user
  test('Follow ahmed', async ({ request }) => {
    if (!jwtToken) throw new Error('JWT token not set from login');

    const response = await request.post(
      `${BASE_URL}/profiles/${targetUser.username}/follow`,
      {
        headers: { Authorization: `Bearer ${jwtToken}` },
      },
    );
    expect([200, 201]).toContain(response.status()); // some APIs return 201
    const body = await response.json();
    expect(body.profile.following).toBe(true);
  });

  // 6️⃣ Unfollow target user
  test('Unfollow ahmed', async ({ request }) => {
    if (!jwtToken) throw new Error('JWT token not set from login');

    const response = await request.delete(
      `${BASE_URL}/profiles/${targetUser.username}/follow`,
      {
        headers: { Authorization: `Bearer ${jwtToken}` },
      },
    );
    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body.profile.following).toBe(false);
  });
});
