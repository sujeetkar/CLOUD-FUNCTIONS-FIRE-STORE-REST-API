import bcrypt from 'bcryptjs';

export const comparePassword = async (password: string, hashedPassword: string) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (err) {
        return Promise.reject(err)
    }
}; // TODO

export const hashPassword = async (password: string) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return Promise.resolve(hashedPassword);
    } catch (err) {
        return Promise.reject(err);
    }
}; // TODO
