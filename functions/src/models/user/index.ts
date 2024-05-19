// TODO
import { db } from "../../utils/firebase";
import { USER_COLLECTION_KEY, UserDocument, userConverter } from "./user.entity";

const COLLECTION_KEY = USER_COLLECTION_KEY;
const converter = userConverter;

export const getUser = async (id: string) => {
    try {
        const docRef = db.collection(COLLECTION_KEY).doc(id).withConverter(converter);

        const docSnap = await docRef.get();
        return docSnap.data();
    } catch (err) {
        return Promise.reject(err);
    }
}

export const addUser = async (user: UserDocument) => {
    try {
        console.log(user);
        const docRef = db.collection(COLLECTION_KEY).doc(user.user_id).withConverter(converter);
        await docRef.set(user, { merge: true });
        return Promise.resolve();
    } catch (err) {
        return Promise.reject(err);
    }
};

export const deleteUser = async (id: string) => {
    try {
        const docRef = db.collection(COLLECTION_KEY).doc(id).withConverter(converter);
        await docRef.delete();
        return Promise.resolve();
    } catch (err) {
        return Promise.reject(err);
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        const docRef = await db.collection(COLLECTION_KEY).where('email', '==', email).withConverter(converter).get();
        const users: UserDocument[] = [];
        docRef.forEach((doc) => {
            users.push(doc.data());
        });
        return users;
    } catch (err) {
        return Promise.reject(err);
    }
}

export const updateUserFields = async (user_id: string, updateFields: {}) => {
    try {
        const docRef = db.collection(COLLECTION_KEY).doc(user_id).withConverter(converter);
        const docSnap = await docRef.get();
        const userData = docSnap.data();
        
        if(!userData) {
            return Promise.reject('User does not exist!');
        }

        const updatedUserData: UserDocument = {...userData, ...updateFields};
        await docRef.set(updatedUserData, {merge: true});
        return Promise.resolve();
    } catch (err) {
        return Promise.reject(err);
    }
};
