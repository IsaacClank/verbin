import { Message } from '../_types';
import Database from '../services/database';
import { v4 } from 'uuid';

interface Post {
  title: string;
  body: string;
}

export const addPost = (
  post: Post,
  user: any,
  callback: (err: any | Message, data?: Message, content_id?: string) => void
) => {
  const post_id = `post-${v4()}`;
  const content_id = `content-${v4()}`;
  Database.run(
    'INSERT INTO posts(post_id,title,body,like_counts,post_status,email,content_id) VALUES(?,?,?,?,?,?,?)',
    [post_id, post.title, post.body, 0, 0, user.email, content_id],
    err => {
      if (err) return callback(new Message(500, { error: 'Internal error', detail: err }));
      else return callback(null, new Message(200, { message: 'Done' }), content_id);
    }
  );
};

export const getPosts = (callback: (err: any | Message, data?: Message) => void) => {
  Database.all('SELECT * FROM posts', (err, rows) => {
    if (err) return callback(new Message(500, { error: 'Internal error', detail: err }));
    else return callback(null, new Message(200, { posts: rows }));
  });
};
