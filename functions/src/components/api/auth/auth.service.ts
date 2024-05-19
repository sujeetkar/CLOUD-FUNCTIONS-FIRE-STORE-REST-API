import { logger } from 'firebase-functions/v1';
import {
  badImplementationException,
  dataConflictException,
  dataNotExistException,
  HttpException,
  invalidException,
} from '../../../utils/apiErrorHandler';
import { sendMessage } from '../../../utils/sgMailer';
import { hashPassword } from '../../../utils/bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { getAddToCurrentJST, getCurrentJST } from '../../../utils/dayjs';
import { TokenDocument } from '../../../models/token/token.entity';
import { addToken, deleteToken, getToken } from '../../../models/token';
import { MESSAGE_RESET_PASSWORD } from './auth.message';
import { addUser, getUserByEmail, updateUserFields } from '../../../models/user';
import { UserDocument } from '../../../models/user/user.entity';
import { refreshToken } from 'firebase-admin/app';

export const createUser = async (email: string, password: string, name: string, phone: string, address: string) => {
  // TODO
  let error: Error | HttpException | undefined;
  try {
    console.log(email, password, name, phone, address);
    const user_id = uuidv4();
    const newUser: UserDocument = {
      user_id: user_id,
      email,
      password: await hashPassword(password),
      name,
      phone,
      address,
      refresh_token: '',
      status: 'active',
      created_at: getCurrentJST(),
      updated_at: '',
      deleted_at: '',
    }
    await addUser(newUser);
  } catch (err) {
    logger.error(err);
    error = err instanceof Error ? err : badImplementationException(err);
    return Promise.reject(error);
  }
};

export const forgotPassword = async (user: UserDocument) => {
  let error: Error | HttpException | undefined;
  try {
    const newToken: TokenDocument = {
      token_id: uuidv4(),
      user_id: user.user_id,
      token_type: 'resetPassword',
      user_type: 'user',
      created_at: getCurrentJST(),
      expired_at: getAddToCurrentJST(1, 'h'),
    };

    await addToken(newToken);

    const tokenUrl = process.env.FRONTEND_URL + '/user/password/reset/' + newToken.token_id;

    await sendMessage(MESSAGE_RESET_PASSWORD(user.email, tokenUrl));

    return Promise.resolve('success');
  } catch (err) {
    logger.error(err);
    error = err instanceof Error ? err : badImplementationException(err);
    return Promise.reject(error);
  }
};

export const updatePassword = async (password: string, tokenId: string) => {
  let error: Error | HttpException | undefined;
  try {
    const token = await getToken(tokenId);
    if (!token) throw dataNotExistException('Token does not exist');
    if (token.user_type !== 'user') throw invalidException('Token is not valid user type');
    if (token.token_type !== 'resetPassword') throw invalidException('Token is not valid token type');

    // TODO
    await updateUserFields(token.user_id, { password: await hashPassword(password), updated_at: getCurrentJST() });

    await deleteToken(tokenId);

    return Promise.resolve();
  } catch (err) {
    console.log(err);
    error = err instanceof Error ? err : badImplementationException(err);
    return Promise.reject(error);
  }
};
