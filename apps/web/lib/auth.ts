import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from './database';
import { redis } from './redis';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  organizationId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  organizationName?: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// Store token in Redis (for logout functionality)
export async function storeToken(token: string, userId: string): Promise<void> {
  try {
    const payload = verifyToken(token);
    if (payload) {
      const expiresIn = 7 * 24 * 60 * 60; // 7 days in seconds
      await redis.setEx(`token:${token}`, expiresIn, userId);
    }
  } catch (error) {
    console.error('Redis storeToken error:', error);
    // Don't throw error, just log it - login should still work without Redis
  }
}

// Check if token is blacklisted
export async function isTokenBlacklisted(token: string): Promise<boolean> {
  try {
    const result = await redis.get(`token:${token}`);
    return result === null; // If token doesn't exist in Redis, it's blacklisted
  } catch (error) {
    console.error('Redis isTokenBlacklisted error:', error);
    return false; // If Redis is down, assume token is not blacklisted
  }
}

// Blacklist token (logout)
export async function blacklistToken(token: string): Promise<void> {
  try {
    await redis.del(`token:${token}`);
  } catch (error) {
    console.error('Redis blacklistToken error:', error);
    // Don't throw error, just log it
  }
}

// Login user
export async function loginUser(credentials: LoginCredentials) {
  const { email, password } = credentials;
  
  console.log('loginUser called for email:', email);

  try {
    // Find user with organization
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organizationMembers: {
          include: {
            organization: true
          }
        }
      }
    });

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found for email:', email);
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      console.log('User account is deactivated');
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      throw new Error('Invalid credentials');
    }

    // Get user's organization
    const organization = user.organizationMembers[0]?.organization;
    console.log('Organization found:', organization ? organization.name : 'None');

    // Generate JWT token
    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: organization?.id
    };

    const token = generateToken(tokenPayload);
    console.log('JWT token generated');

    // Store token in Redis
    await storeToken(token, user.id);
    console.log('Token stored in Redis');

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: organization ? {
          id: organization.id,
          name: organization.name
        } : null
      },
      token
    };
  } catch (error) {
    console.error('Error in loginUser:', error);
    throw error;
  }
}

// Register user
export async function registerUser(data: RegisterData) {
  const { email, password, name, organizationName } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user and organization in transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create organization if provided
    let organization = null;
    if (organizationName) {
      organization = await tx.organization.create({
        data: {
          name: organizationName,
          domain: email.split('@')[1]
        }
      });
    }

    // Create user
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: organization ? 'ADMIN' : 'EMPLOYEE'
      }
    });

    // Add user to organization if created
    if (organization) {
      await tx.organizationMember.create({
        data: {
          organizationId: organization.id,
          userId: user.id,
          role: 'admin'
        }
      });
    }

    return { user, organization };
  });

  // Generate JWT token
  const tokenPayload: JWTPayload = {
    userId: result.user.id,
    email: result.user.email,
    role: result.user.role,
    organizationId: result.organization?.id
  };

  const token = generateToken(tokenPayload);

  // Store token in Redis
  await storeToken(token, result.user.id);

  return {
    user: {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
      organization: result.organization ? {
        id: result.organization.id,
        name: result.organization.name
      } : null
    },
    token
  };
}
