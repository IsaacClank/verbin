import styles from './Post.module.scss';
import { SERVER } from '../_config';
import ReactAudioPlayer from 'react-audio-player';
import { AiFillHeart } from 'react-icons/ai';
import { FaCommentAlt } from 'react-icons/fa';
import { MdReportProblem } from 'react-icons/md';
import { useEffect, useRef, useState } from 'react';

const ReportWindow = ({ openReport, setOpenReport }) => {
  return (
    <div
      className={(() => (openReport ? `${styles.report}` : `${styles.report} ${styles.hidden}`))()}
    >
      <div className={styles.flexContainer}>
        <div className={styles.row}>
          <form
            onSubmit={e => {
              e.preventDefault();
              setOpenReport(false);
            }}
          >
            <div>
              <input type='radio' value='1' name='reason' />
              <label>Sexual content</label>
            </div>
            <div>
              <input type='radio' value='2' name='reason' />
              <label>Violent content</label>
            </div>
            <div>
              <input type='radio' value='3' name='reason' />
              <label>Hateful or repulsive content</label>
            </div>
            <div>
              <input type='radio' value='4' name='reason' />
              <label>Promotes misinformation</label>
            </div>
            <div>
              <input type='radio' value='5' name='reason' />
              <label>Inappropriate language</label>
            </div>
            <hr />
            <div className={styles.submitReport}>
              <input type='submit' value='Submit' />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const CommentSection = () => {
  return (
    <div id={styles.CommentSection} className={styles.flexContainer}>
      <div className={styles.row}>
        <div className={styles.col}>
          <div />
        </div>
        <div className={styles.col}>Some_guy_on_the_Internet</div>
      </div>
      <div className={styles.row}>A certified bobber</div>
    </div>
  );
};

const Post = ({ detail, id }) => {
  const [username, setUsername] = useState(undefined);
  const [openComments, setOpenComments] = useState(false);
  const [like, setLike] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const commentRef = useRef(undefined);

  useEffect(() => {
    if (!commentRef) return;

    if (!openComments) {
      commentRef.current.className = `${styles.comments} ${styles.row} ${styles.hidden}`;
    } else {
      commentRef.current.className = `${styles.comments} ${styles.row}`;
    }
  }, [openComments, commentRef]);

  useEffect(() => {
    if (!username)
      fetch(`${SERVER}/auth/info/${detail.email}`)
        .then(r => r.json())
        .then(r => setUsername(r.user.name));
  }, [username]);

  return (
    <>
      <div className={`${styles.post} ${styles.flexContainer}`} id={id}>
        <div className={styles.row}>
          <div className={`${styles.profileImg} ${styles.col}`}>
            <div />
          </div>
          <div className={`${styles.username} ${styles.col}`}>{username}</div>
        </div>
        <div className={styles.row}>
          <div className={`${styles.postBody} ${styles.col}`}>
            <p>{detail.body}</p>
          </div>
        </div>
        <div className={styles.row}>
          <div className={`${styles.music} ${styles.col}`}>
            <ReactAudioPlayer
              src={`http://localhost:3001/audio/1`}
              controls
              crossOrigin='anonymous'
            />
          </div>
        </div>
        <div className={`${styles.row} ${styles.interactButtons}`}>
          <div className={styles.col}>
            <button
              onClick={() => setLike(l => !l)}
              className={(() => (like ? `${styles.clicked}` : ''))()}
            >
              <AiFillHeart />
            </button>
          </div>
          <div className={styles.col}>
            <button
              onClick={() => setOpenComments(c => !c)}
              className={(() => (openComments ? `${styles.clicked}` : ''))()}
            >
              <FaCommentAlt />
            </button>
          </div>
          <div className={styles.col}>
            <button onClick={() => setOpenReport(true)}>
              <MdReportProblem />
            </button>
          </div>
        </div>
        <div ref={commentRef} className={`${styles.comments} ${styles.row} ${styles.hidden}`}>
          <CommentSection />
        </div>
      </div>
      <ReportWindow openReport={openReport} setOpenReport={setOpenReport} />
    </>
  );
};

export default Post;
