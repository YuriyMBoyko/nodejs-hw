import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

const SESSION_NOT_FOUND = 'Session not found';

export const authenticate = async (req, res, next) => {
  const { sessionId, accessToken } = req.cookies;

  if (!sessionId || !accessToken) {
    throw createHttpError(401, 'Missing session credentials');
  }

  if (
    typeof accessToken !== 'string' ||
    typeof sessionId !== 'string' ||
    !isValidObjectId(sessionId)
  ) {
    throw createHttpError(401, SESSION_NOT_FOUND);
  }

  const session = await Session.findOne({ _id: sessionId, accessToken });

  if (!session) {
    throw createHttpError(401, SESSION_NOT_FOUND);
  }

  if (session.accessTokenValidUntil.getTime() < Date.now()) {
    throw createHttpError(401, 'Access token expired');
  }

  const user = await User.findById(session.userId);

  if (!user) {
    throw createHttpError(401);
  }

  req.user = user;
  next();
};
