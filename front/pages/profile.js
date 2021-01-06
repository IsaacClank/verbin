import styles from "./profile.module.scss";
import ReactAudioPlayer from "react-audio-player";
import Image from "next/image";

const profile = () => {
  return (
    <>
      <div className={styles.container} id={styles.FlexCol}>
        <div className={styles.userBackground}>
          <div className={styles.profileImgWrap}>
            <Image
              id={styles.ProfileImg}
              src="/assets/image3.jpg"
              width="200"
              height="200"
            />
          </div>
        </div>
        <h1>Dương Phúc Thịnh</h1>
        <button>Change profile</button>
        <div id={styles.FlexRow} className={styles.profileNav}>
          <button>Information</button>
          <button>Playlist</button>
          <button>Follow</button>
          <button>Liked</button>
        </div>
      </div>
    </>
  );
};
export default profile;
