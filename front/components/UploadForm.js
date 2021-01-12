import styles from './UploadForm.module.scss';
import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { SERVER } from '../_config';

const UploadForm = ({ closeForm, open }) => {
  const user = useSWR('/auth', url =>
    fetch(`${SERVER}${url}`, {
      credentials: 'include',
    }).then(r => r.json())
  );

  const [body, setBody] = useState('');
  const [file, setFile] = useState(undefined);

  const submitHandler = useCallback(
    e => {
      e.preventDefault();
      user.mutate().then(_ => {
        const data = new FormData();
        data.append('content', file);
        data.append('body', body);
        data.append('user', JSON.stringify(user.data));

        fetch(`${SERVER}/post/new`, {
          credentials: 'include',
          method: 'POST',
          body: data,
        });

        closeForm();
      });
    },
    [user, body, file]
  );

  return (
    <div id={styles.UploadForm} className={open ? '' : styles.hidden}>
      <form onSubmit={submitHandler}>
        <div id={styles.Body}>
          <textarea
            type='text'
            name='body'
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder='What do you want to say?'
          />
        </div>
        <div id={styles.PostOption}>
          <input type='file' name='file' onChange={e => setFile(e.target.files[0])} />
        </div>
        <div id={styles.Submit}>
          <input type='submit' value='Post' />
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
