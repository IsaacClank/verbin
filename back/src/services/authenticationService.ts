import { Handler, Message } from '../_types';
import { v4 as generateId } from 'uuid';
import db from './database';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { BCRYPT_SALT } from '../_config';

export interface User {
  email: string;
  password: string;
  name?: string;
  verified?: boolean;
  accountStatus?: number;
}

export const signup = (user: User, callback: Handler) => {
  if (!(user.name && user.email && user.password))
    callback(new Message(400, { error: 'missing information' }));

  db.run(
    'INSERT INTO accounts(account_id,name,verified,account_status,email,password) VALUES(?,?,?,?,?,?)',
    [generateId(), user.name, false, 0, user.email, encryptPassword(user.password)],
    err => {
      if (err) return callback(new Message(500, { error: 'internal error', detail: err }));
      else
        callback(
          null,
          new Message(200, {
            message: 'user is authenticated',
            authenticated: true,
            account: { email: user.email, name: user.name, verified: false, accountStatus: 0 },
          })
        );
    }
  );
};

export const signin = (user: User, callback: Handler) => {
  if (!(user.email && user.password)) callback(new Message(400, { error: 'missing information' }));

  db.serialize(() => {
    db.get(
      'SELECT email,name,verified,account_status,password FROM accounts WHERE email=?',
      [user.email],
      (err, acc) => {
        if (err || !acc) callback(new Message(400, { error: 'no matching email' }));
        else if (!checkPassword(acc.password, user.password))
          callback(new Message(400, { error: 'wrong password' }));
        else
          callback(
            null,
            new Message(200, {
              message: 'user is logged in',
              authenticated: true,
              account: {
                email: acc.email,
                name: acc.name,
                verified: Boolean(acc.verified),
                accountStatus: acc.account_status,
              } as User,
            })
          );
      }
    );
  });
};

export const getAccountDetail = (
  email: string,
  callback: (err: any | Message, data?: Message) => void
) => {
  db.get('SELECT name FROM accounts WHERE email=?', [email], (err, result) => {
    if (err) return callback(new Message(500, { error: 'Internal error', detail: err }));
    else return callback(null, new Message(200, { user: result }));
  });
};

// ---------------------------------------------------------UTILS---------------------------------------------------------
const encryptPassword = (pass: string) =>
  hashSync(pass, genSaltSync(parseInt(BCRYPT_SALT || '10')));

const checkPassword = (pass: string, uncheckedPass: string) => compareSync(uncheckedPass, pass);
