import { NextFunction, Request, Response, Router } from 'express';
import { Message, PlainObject } from '../_types';
import * as AuthService from '../services/authenticationService';

// ------------------------------------------MIDDLEWARES--------------------------------------------------
const parseUserAuthentication = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.err) {
    res.locals.user = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    };
  }
  return next();
};

// --------------------------------------------------ROUTE_DEFINTION--------------------------------------------------
const router = Router();

router.get('/', (req, res, next) => {
  let session = req.session as PlainObject;
  res.locals.msg = new Message(200, { authenticated: session.user ? true : false });
  if (session.user) {
    (res.locals.msg as Message).addData(session.user);
  }
  return next();
});

router.get('/info/:email', (req, res, next) => {
  AuthService.getAccountDetail(req.params.email, (err, r) => {
    if (err) res.locals.err = err;
    else res.locals.msg = r;
    return next();
  });
});

router.post('/signup', parseUserAuthentication, (req, res, next) => {
  AuthService.signup(res.locals.user, (err, msg) => {
    if (err != null) res.locals.err = err;
    else {
      res.locals.msg = msg;
      req.session.regenerate(err => {
        if (err)
          res.locals.err = new Message(500, { error: 'error while updating session', detail: err });
      });
      (req.session as PlainObject).user = msg?.data.account;
    }
    return next();
  });
});

router.post('/signin', parseUserAuthentication, (req, res, next) => {
  AuthService.signin(res.locals.user, (err, msg) => {
    if (err != null) res.locals.err = err;
    else {
      res.locals.msg = msg;
      req.session.regenerate(err => {
        if (err)
          res.locals.err = new Message(500, { error: 'error while updating session', detail: err });
      });
      (req.session as PlainObject).user = msg?.data.account;
    }
    return next();
  });
});

router.get('/signout', (req, res, next) => {
  req.session.regenerate(err => {
    if (err) {
      res.locals.err = new Message(500, { error: 'Internal error while updating session' });
    } else {
      res.locals.msg = new Message(200, { message: 'user is logged out', authenticated: false });
    }
    return next();
  });
});

export { router as AuthRouter };
