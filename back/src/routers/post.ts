import { Router } from 'express';
import path from 'path';
import * as PostService from '../services/postService';
const router = Router();

router.post('/new', (req, res, next) => {
  const user = JSON.parse(req.body.user);
  const file = (req.files as any).content;
  const postBody = req.body.body;

  PostService.addPost(
    {
      title: 'random-title',
      body: postBody,
    },
    user,
    (err, r, content_id) => {
      if (err) res.locals.err = err;
      else {
        file.mv(path.resolve('audio') + `/${content_id}.mp3`);
        res.locals.msg = r;
      }
      return next();
    }
  );
});

router.get('/', (req, res, next) => {
  PostService.getPosts((err, r) => {
    if (err) res.locals.err = err;
    else res.locals.msg = r;
    return next();
  });
});

export { router as PostRouter };
