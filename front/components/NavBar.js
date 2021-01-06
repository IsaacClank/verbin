import styles from './NavBar.module.scss';
import Image from 'next/image';
import { FaSearch, FaUser } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';
import { AiFillSetting } from 'react-icons/ai';
import Link from 'next/link';
import useSWR from 'swr';
import { SERVER } from '../_config';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const SearchBar = () => {
  return (
    <form id={styles.SearchBar}>
      <button>
        <FaSearch />
      </button>
      <input type='text' />
    </form>
  );
};

const AuthenticatedButton = () => {
  const [drop, setDrop] = useState(false);
  const router = useRouter();

  const handleSignOut = () =>
    fetch(`${SERVER}/auth/signout`, { credentials: 'include' }).then(r => {
      if (r.status === 200) router.reload();
    });

  return (
    <div id={styles.AuthenticatedButton}>
      <button
        onClick={() => setDrop(d => !d)}
        className={drop ? `${styles.open} ${styles.navButtons}` : styles.navButtons}
      >
        <FaUser />
      </button>
      <div id={styles.ProfileDropdown} className={drop ? '' : styles.hidden}>
        <div>
          <Link href='/profile'>
            <button>Profile</button>
          </Link>
          <button onClick={handleSignOut}>Sign out</button>
        </div>
      </div>
    </div>
  );
};

const NotificationWindow = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.relativeContainer}>
      <button
        onClick={() => setOpen(o => !o)}
        className={open ? `${styles.navButtons} ${styles.open}` : styles.navButtons}
      >
        <IoMdNotifications />
      </button>
      {open ? (
        <div className={styles.dropdown}>
          <div>nothing here ...</div>
        </div>
      ) : null}
    </div>
  );
};

const NavBar = () => {
  const { data } = useSWR(`/auth`, url =>
    fetch(`${SERVER}${url}`, {
      credentials: 'include',
    }).then(r => r.json())
  );

  const [authenticated, setAuthenticated] = useState(undefined);

  useEffect(() => {
    if (data) setAuthenticated(data.authenticated);
  }, [data]);

  return data ? (
    <div id={styles.NavBar}>
      <div id={styles.Brand}>
        <Link href='/'>
          <button>
            <Image src='/assets/VERBIN.png' width='48' height='40' />
            <span>Verbin</span>
          </button>
        </Link>
      </div>
      <SearchBar />
      <div id={styles.NavButtons}>
        {!authenticated ? (
          <Link href='/authentication'>
            <button className={styles.navButtons}>
              <FaUser />
            </button>
          </Link>
        ) : (
          <AuthenticatedButton />
        )}
        <NotificationWindow />
        <button className={styles.navButtons}>
          <AiFillSetting />
        </button>
      </div>
    </div>
  ) : null;
};
export default NavBar;
