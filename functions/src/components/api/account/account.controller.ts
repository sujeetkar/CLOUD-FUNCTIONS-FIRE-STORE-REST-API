import { Request, Response, NextFunction } from 'express';
import { getUser, updateUserFields } from '../../../models/user';
import { hashPassword } from '../../../utils/bcrypt';
import { getCurrentJST } from '../../../utils/dayjs';
import { UserDocument } from '../../../models/user/user.entity';
import { db } from '../../../utils/firebase';
import { dataConflictException, dataNotExistException } from '../../../utils/apiErrorHandler';
import { updateAccount as updateAccountService } from './account.service';


export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.user_id) {
        throw dataConflictException('User ID not found in request');
      }
  
      const { user_id } = req.user;
      const { name, phone, address } = req.body;
  
      await updateAccountService(user_id, {name: name, phone: phone, address: address});
  
      res.status(200).json({ message: 'Account updated successfully' });
    } catch (error) {
      next(error);
    }
  };

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user.user_id) {
            throw dataConflictException('User ID not found in request');
        }    
        const { user_id } = req.user;
        const { password } = req.body;

        const hashedPassword = await hashPassword(password);

        await updateUserFields(user_id, { password: hashedPassword, updated_at: getCurrentJST() });

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
};

export const getAccountInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('req ***************',req)
        if (!req.user || !req.user.user_id) {
            throw dataConflictException('User ID not found in request');
        }

        const {user_id} = req.user;

        const user = await getUser(user_id);
        console.log(user);
        if (!user) {
            throw dataNotExistException('user does not exist.')
        }

        res.status(200).json({user})
    } catch (error) {
        next(error);
    }
};
