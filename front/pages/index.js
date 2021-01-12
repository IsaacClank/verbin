import Post from '../components/Post';
import styles from './index.module.scss';
import useSWR from 'swr';
import { useEffect } from 'react';
import { SERVER } from '../_config';

export default function Home() {
  const { data } = useSWR('/post', url =>
    fetch(`${SERVER}${url}`, { credentials: 'include' })
      .then(r => r.json())
      .then(r => r.posts)
  );

  return (
    <div id={styles.Page}>
      <div id={styles.ContentWrapper}>
        <div id={styles.Content}>
          {Array.isArray(data)
            ? data.map((p, index) => <Post detail={p} id={`${index}+post`} />)
            : null}
        </div>
      </div>
    </div>
  );
}
