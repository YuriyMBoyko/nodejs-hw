import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies, SESSION_COOKIE_OPTIONS } from '../services/auth.js';

const EMAIL_IN_USE = 'Email in use';
const INVALID_CREDENTIALS = 'Invalid credentials';
const SESSION_NOT_FOUND = 'Session not found';

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, EMAIL_IN_USE);
  }

  const hashPassword = await bcrypt.hash(password, 10);
  let newUser;

  try {
    newUser = await User.create({ username, email, password: hashPassword });
  } catch(error) {
    if (error.code === 11000) {
      throw createHttpError(400, EMAIL_IN_USE);
    }

    throw error;
  }

  const newSession = await createSession(newUser._id);

  setSessionCookies(res, newSession);

  res.status(201).json(newUser);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createHttpError(401, INVALID_CREDENTIALS);
  }

//  await Session.deleteOne({ userId: user._id });
  await Session.deleteMany({ userId: user._id });

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.status(200).json(user);
};

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies || {};

  if (typeof sessionId === 'string' && isValidObjectId(sessionId)) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookies('sessionId', SESSION_COOKIE_OPTIONS);
  res.clearCookies('accessToken', SESSION_COOKIE_OPTIONS);
  res.clearCookies('refreshToken', SESSION_COOKIE_OPTIONS);

  res.status(204).send();
};

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (
    typeof sessionId !== 'string' ||
    !isValidObjectId(sessionId) ||
    typeof refreshToken !== 'string' ||
    !refreshToken
  ) {
    throw createHttpError(401, 'Missing session credentials');
  }

  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    createHttpError(401, SESSION_NOT_FOUND);
  }

  const isRefreshTokenValid = (session.refreshTokenValidUntil < new Date());

  if (!session.refreshTokenValidUntil.getTime() <= Date.now()) {
    await session.deleteOne();

    res.clearCookies('sessionId', SESSION_COOKIE_OPTIONS);
    res.clearCookies('accessToken', SESSION_COOKIE_OPTIONS);
    res.clearCookies('refreshToken', SESSION_COOKIE_OPTIONS);

    throw createHttpError(401, 'Session token expired');
  }

  const { deletedCount } = await session.deleteOne();
  if (deletedCount === 0) {
    throw createHttpError(401, SESSION_NOT_FOUND);
  }

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({ message: 'Session refreshed' });
};
