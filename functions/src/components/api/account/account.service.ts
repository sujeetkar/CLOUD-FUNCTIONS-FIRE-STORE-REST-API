import { updateUserFields } from '../../../models/user';
import { getCurrentJST } from '../../../utils/dayjs';

export const updateAccount = async (user_id: string, newData: {}) => {
  try {
    await updateUserFields(user_id, { ...newData, updated_at: getCurrentJST() });
    return Promise.resolve('Account updated successfully');
  } catch (error) {
    throw Promise.reject(error);
  }
};

export const updatePassword = async (user_id: string, newPassword: String) => {
  try {
    await updateUserFields(user_id, { password: newPassword, updated_at: getCurrentJST() });
    return Promise.resolve('Password updated successfully');
  } catch (error) {
    return Promise.reject(error);
  }
};
