import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import MyPosts from "../routes/my-posts";
import MyLikes from "../routes/my-likes";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const AvatarUpload = styled.div`
  width: 100px;
  overflow: hidden;
  height: 100px;
  z-index: 50;
  border-radius: 50%;
  background-color: white;
  display: flex;
  justify-content: center;
  flex-direction: column;
  svg {
    width: 50px;
  }

  user-select: none;

  position: relative;
  position: absolute;
  bottom: 15%;
  left: 7%;
`;

const AvatarUploadBtn = styled.label`
  border: none;
  background: none;
  height: 50%;
  width: 100%;
  &:hover {
    background-color: #000000c8;
    cursor: pointer;
    text-indent: 0px;
    color: white;
    font-family: "Noto Sans KR";
    font-weight: 600;
    font-size: 16px;
  }
  z-index: 55;
  text-rendering: none;
  text-indent: -10000px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const BackgroundUploadBtn = styled.label`
  border: none;
  background: none;
  height: 30%;
  width: 100%;
  background-color: white;
  cursor: pointer;

  font-family: "Noto Sans KR";
  font-weight: 600;
  font-size: 14px;
  &:hover {
    color: white;
    background-color: #000000c8;
  }
  z-index: 55;
  text-rendering: none;
  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0px 0px 10px #3d3d3dc7;
  border-radius: 50px;
`;
const AvatarDeleteBtn = styled.button`
  border: none;
  background: none;
  height: 50%;
  width: 100%;
  &:hover {
    background-color: #000000c8;
    cursor: pointer;
    text-indent: 0px;
    color: white;
    font-family: "Noto Sans KR";
    font-weight: 600;
    font-size: 14px;
  }
  z-index: 55;
  text-indent: -10000px;
`;

const BackgroundDeleteBtn = styled.button`
  border: none;
  background: none;
  height: 30%;
  width: 100%;
  background-color: white;
  cursor: pointer;

  font-family: "Noto Sans KR";
  font-weight: 600;
  font-size: 14px;
  &:hover {
    color: white;
    background-color: #000000c8;
  }
  z-index: 60;
  text-rendering: none;
  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0px 0px 10px #3d3d3dc7;
  border-radius: 50px;
`;

const AccountDeleteBtn = styled.button`
  border: none;
  background: none;
  height: 30%;
  width: 100%;
  background-color: white;
  color: tomato;
  cursor: pointer;

  font-family: "Noto Sans KR";
  font-weight: 600;
  font-size: 14px;
  &:hover {
    color: tomato;
    background-color: #000000c8;
  }
  z-index: 60;
  text-rendering: none;
  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0px 0px 10px #3d3d3dc7;
  border-radius: 50px;
`;

const BackgroundLocationBar = styled.input`
  border: none;
  height: 30%;
  width: 100%;
  background-color: white;
  cursor: pointer;

  background: linear-gradient(
    to right,
    white 0%,
    white 50%,
    #ececec 50%,
    #ececec 100%
  );
  border-radius: 8px;
  outline: none;
  transition: background 450ms ease-in;
  -webkit-appearance: none;
  accent-color: #000000;

  font-family: "Noto Sans KR";
  font-weight: 600;
  font-size: 14px;

  z-index: 60;
  text-rendering: none;

  box-shadow: 0px 0px 10px #3d3d3dc7;
  border-radius: 50px;
`;

const AvatarImg = styled.img`
  width: 100%;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  z-index: 51;
`;
const AvatarInput = styled.input`
  display: none;
`;
const BackgroundInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 20px;
  font-family: "Noto Sans KR";
  font-weight: 500;
  margin-bottom: 0.5px;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  width: 600px;
  height: 200px;
  margin-top: 10px;
  padding: 30px;
  padding-left: 40px;
  border-radius: 25px;
  box-shadow: 0px 0px 10px gray;
  position: relative;
  overflow: hidden;
  background-color: black;
`;

const LeftCard = styled.div`
  display: flex;
  gap: 20px;
  width: 80%;
`;

const RightCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 40%;
  height: 100%;
  position: relative;
`;

const NameStuffCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  gap: 4px;
  position: absolute;
  z-index: 50;
  bottom: 10%;
  left: 26.5%;
`;

const Email = styled.span`
  font-size: 15px;
  font-family: "Noto Sans KR";
  font-weight: 500;
  color: #808080a4;
  margin-left: 7px;
`;

const UnderPage = styled.div`
  width: 100%;
  min-height: 200px;
  user-select: none;
`;
const Switch = styled.div`
  margin-top: 25px;
  width: 100%;
  padding: 30px 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px -5px 5px #5f5f5f57;
  max-height: 550px;
  overflow: scroll;
`;

const SwitchBar = styled.div`
  width: 250px;
  height: 80px;
  display: flex;
  justify-content: space-between;
`;

const FalseSwitchButton = styled.button`
  background: none;
  width: 100px;
  height: 55px;
  border: none;
  font-size: 25px;
  font-family: "Noto Sans KR";
  font-weight: 500;
  border-radius: 25px;
  color: #000000c8;
  background-color: white;
  box-shadow: 0px 0px 7px #6e6e6e39;
  cursor: pointer;
  &.selected {
    color: white;
    background-color: #000000c8;
    box-shadow: 0px 0px 7px #6e6e6e39;
  }
`;
const TrueSwitchButton = styled.button`
  background: none;
  width: 100px;
  height: 55px;
  border: none;
  font-size: 25px;
  font-family: "Noto Sans KR";
  font-weight: 500;
  border-radius: 25px;
  color: #000000c8;
  background-color: white;
  box-shadow: 0px 0px 7px #6e6e6e39;
  cursor: pointer;
  &.selected {
    color: white;
    background-color: #000000c8;
    box-shadow: 0px 0px 7px #6e6e6e39;
  }
`;

const ScrollDiv = styled.div`
  height: 465px;
  width: 100%;
  overflow: scroll;
`;

const WhiteBar = styled.div`
  position: absolute;
  width: 100%;
  height: 70px;
  background-color: white;

  bottom: 0%;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 30;
`;

const BackgroundImg = styled.img`
  width: 100%;
`;

const BackgroundHandle = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 120px;
  gap: 7px;
`;

const MeatBallMenu = styled.button`
  border: 0;
  width: 37px;
  height: 37px;
  background: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' class='w-6 h-6'%3E%3Cpath fill-rule='evenodd' d='M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z' clip-rule='evenodd' /%3E%3C/svg%3E%0A");
  border-radius: 50%;
  position: absolute;
  right: -15%;
  top: 0;
  transform: translate(-50%, -50%);
  z-index: 100;
  background-color: white;
  cursor: pointer;
  &:hover {
    background-color: #f1f1f1;
  }
`;
const OpendMeatballMenu = styled.div`
  background-color: #ffffff;
  border-radius: 18px;
  position: absolute;
  top: 35px;
  overflow: hidden;
  box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.12);
  z-index: 101;
`;

const BackgroundDiv = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  bottom: ${(props) => props.bgLevel}px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 20;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
`;

const BackgroundLevel = styled.div`
  width: 100%;
  height: 1px;
  margin-top: 300px;
`;

const MeatBall = styled.div``;

const UpperBar = styled.div`
  width: 94%;
  height: 60px;
  display: flex;
  align-items: center;
`;
const Arrow = styled.button`
  padding: 10px;
  height: 100%;
  width: 58px;
  background: none;
  border: none;
  border-radius: 50%;
  &:hover {
    background-color: #b1b1b144;
    cursor: pointer;
  }
`;
const Title = styled.span`
  font-family: "Noto Sans KR";
  font-size: 25px;
  font-weight: 700;
`;

export default function MakeProfilePage() {
  const location = useLocation();
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [isDefaltProfileImg, setIsDefaltProfileImg] = useState(true);
  const [isSwitched, setIsSwitched] = useState(false);
  const [isFalseSelected, setIsFalseSelected] = useState("selected");
  const [isTrueSelected, setIsTrueSelected] = useState("");
  const {
    username,
    photo,
    post,
    userId,
    id,
    hasPhoto,
    likesNumber,
    likesUserIdList,
    SavedUserList,
  } = location.state;
  const [isDefaltBackgroundImg, setIsDefaltBackgroundImg] = useState(false);
  const [backgroundImg, setBackgroundImg] = useState(null);
  const [email, setEmail] = useState("taein071215@naver.com");
  const [isOpend, setIsopend] = useState(false);
  const [backgroundLocation, setBackgroundLocation] = useState(50);
  const [isDeletingNow, setIsDeletingNow] = useState(true);
  const [isBackgroundmDeletingNow, setIsBackgroundDeletingNow] =
    useState(false);

  const navigate = useNavigate();
  const onClickBackPage = () => {
    navigate(-1);
  };

  // 프로필 가져오기

  const fetchAvatar = async () => {
    try {
      const profileImgRef = ref(storage, `avatars/${userId}`);
      const avatarUrl = await getDownloadURL(ref(storage, profileImgRef));
      setIsDefaltProfileImg(false);
      setAvatar(avatarUrl);
    } catch (err) {
      setIsDefaltProfileImg(true);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

  const SwitchTrue = () => {
    setIsSwitched(true);
  };

  const SwitchFalse = () => {
    setIsSwitched(false);
  };

  //-------------------------------

  //스위치 스테이트
  const onclick = () => {
    setIsSwitched(!isSwitched);
    if (!isSwitched) {
      setIsTrueSelected("selected");
      setIsFalseSelected("");
    } else {
      setIsTrueSelected("");
      setIsFalseSelected("selected");
    }
  };

  const onAvatarImgDelete = async () => {
    const check = confirm("Are you sure to delete profile image?");
    if (!check || isDefaltProfileImg) {
      return;
    }
    try {
      setIsDeletingNow(true);
      const photoRef = ref(storage, `avatars/${user?.uid}`);
      setAvatar(user?.photoURL);
      await deleteObject(photoRef);
    } catch (err) {
      console.log(err);
    } finally {
      setIsDeletingNow(false);
      setIsDefaltProfileImg(true);
    }
  };

  const onAvatarChange = async (e) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      setIsDefaltProfileImg(false);
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  const onBackgroundChange = async (e) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      setIsDefaltBackgroundImg(false);
      const file = files[0];
      const locationRef = ref(storage, `background/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const backgroundUrl = await getDownloadURL(result.ref);
      setBackgroundImg(backgroundUrl);
      await updateProfile(user, {
        photoURL: backgroundUrl,
      });
    }
  };

  const modalRef = useRef();

  const openMeatball = () => {
    setIsopend(!isOpend);
  };

  const onLocationChange = (e) => {
    setBackgroundLocation(Math.floor(e.target.value));
  };

  const saveBgLevel = async () => {
    const docRef = doc(db, "users", user?.uid);
    await updateDoc(docRef, {
      backgroundLevel: backgroundLocation,
    });
  };

  const onBackgroundImgDelete = async () => {
    const check = confirm("Are you sure to delete Background image?");
    if (!check || isDefaltBackgroundImg) {
      return;
    }
    try {
      setIsBackgroundDeletingNow(true);
      const photoRef = ref(storage, `background/${user?.uid}`);
      setBackgroundImg(user?.photoURL);
      await deleteObject(photoRef);
    } catch (err) {
      console.log(err);
    } finally {
      setIsBackgroundDeletingNow(false);
      setIsDefaltBackgroundImg(true);
    }
  };

  const onDeleteAccount = async () => {
    const ok = confirm("Are you sure to delete your account?");
    if (!ok) return;
    const reallyok = confirm(`Are you Really sure to Delete your account?`);
    if (!reallyok) return;
    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
    } catch (err) {
      console.log(err);
    } finally {
      onClickBackPage();
    }
  };

  const backgroundCheck = async () => {
    try {
      const backgroundImgRef = ref(storage, `background/${userId}`);
      const BackgroundUrl = await getDownloadURL(
        ref(storage, backgroundImgRef)
      );
      setIsDefaltBackgroundImg(false);
      setBackgroundImg(BackgroundUrl);
    } catch (err) {
      setIsDefaltBackgroundImg(true);
    }
  };

  const profileCheck = async () => {
    try {
      const profileImgRef = ref(storage, `avatars/${userId}`);
      const avatarUrl = await getDownloadURL(ref(storage, profileImgRef));
      setIsDefaltProfileImg(false);
      setAvatar(avatarUrl);
    } catch (err) {
      setIsDefaltProfileImg(true);
    }
  };

  const emailAndBgLevelCheck = async () => {
    const docRef = doc(db, "users", `${userId}`);
    const fetchedDoc = getDoc(docRef);
    const { email, backgroundLevel } = (await fetchedDoc).data();
    setEmail(email);
    setBackgroundLocation(backgroundLevel);
  };

  useEffect(() => {
    backgroundCheck();
    profileCheck();
    emailAndBgLevelCheck();
  }, []);

  return (
    <Wrapper>
      <UpperBar>
        <Arrow onClick={onClickBackPage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
              clipRule="evenodd"
            />
          </svg>
        </Arrow>
        <Title>{username}</Title>
      </UpperBar>

      <Card>
        {Boolean(!isDefaltBackgroundImg) ? (
          <BackgroundDiv bgLevel={-10 * backgroundLocation}>
            <BackgroundImg src={backgroundImg} />
            <BackgroundLevel></BackgroundLevel>
          </BackgroundDiv>
        ) : null}

        <WhiteBar></WhiteBar>
        <LeftCard>
          <AvatarUpload>
            {Boolean(!isDefaltProfileImg) ? (
              <AvatarImg src={avatar} />
            ) : (
              <AvatarImg src='data:image/svg+xml,<%3Fxml version="1.0" encoding="UTF-8"%3F><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="165px" height="165px" viewBox="0 0 165 165" version="1.1"><g id="surface1"><path style=" stroke:rgb(100%,100%,100%);fill-rule:evenodd;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 128.460938 131.292969 C 141.925781 118.640625 149.550781 100.976562 149.53125 82.5 C 149.53125 45.476562 119.523438 15.46875 82.5 15.46875 C 45.476562 15.46875 15.46875 45.476562 15.46875 82.5 C 15.449219 100.976562 23.074219 118.640625 36.539062 131.292969 C 48.964844 143.027344 65.410156 149.554688 82.5 149.53125 C 99.589844 149.554688 116.035156 143.027344 128.460938 131.292969 Z M 42.246094 122.457031 C 52.023438 110.226562 66.839844 103.109375 82.5 103.125 C 98.160156 103.109375 112.976562 110.226562 122.753906 122.457031 C 112.117188 133.203125 97.617188 139.238281 82.5 139.21875 C 67.382812 139.238281 52.882812 133.203125 42.246094 122.457031 Z M 108.28125 61.875 C 108.28125 76.113281 96.738281 87.65625 82.5 87.65625 C 68.261719 87.65625 56.71875 76.113281 56.71875 61.875 C 56.71875 47.636719 68.261719 36.09375 82.5 36.09375 C 96.738281 36.09375 108.28125 47.636719 108.28125 61.875 Z M 108.28125 61.875 "/></g></svg>'></AvatarImg>
            )}
          </AvatarUpload>
          <AvatarInput
            id="avatar"
            type="file"
            accept="image/*"
            onChange={onAvatarChange}
          />
          <BackgroundInput
            id="background"
            type="file"
            accept="image/*"
            onChange={onBackgroundChange}
          />
          <NameStuffCard>
            <Name>{username ? username : "Anonymous"}</Name>
            {email ? <Email>{email}</Email> : null}
          </NameStuffCard>
        </LeftCard>
        <RightCard></RightCard>
      </Card>
      <UnderPage>
        <Switch>
          <SwitchBar>
            <FalseSwitchButton
              className={`${isFalseSelected}`}
              onClick={() => {
                onclick();
              }}
            >
              Posts
            </FalseSwitchButton>
            <TrueSwitchButton
              className={`${isTrueSelected}`}
              onClick={() => {
                onclick();
              }}
            >
              Liked
            </TrueSwitchButton>
          </SwitchBar>
          <ScrollDiv>
            {!isSwitched ? (
              <MyPosts userIdPram={`${userId}`}></MyPosts>
            ) : (
              <MyLikes userIdPram={`${userId}`}></MyLikes>
            )}
          </ScrollDiv>
        </Switch>
      </UnderPage>
    </Wrapper>
  );
}
