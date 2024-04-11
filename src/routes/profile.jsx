import styled from "styled-components";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { deleteUser, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { useEffect, useRef, useState } from "react";
import MyPosts from "./my-posts";
import MyLikes from "./my-likes";
import { useNavigate } from "react-router-dom";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";

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
  cursor: pointer;
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
  margin-top: 25px;
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

const Post = styled.div``;
const LikedPost = styled.div``;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [backgroundImg, setBackgroundImg] = useState(null);
  const [isDeletingNow, setIsDeletingNow] = useState(false);
  const [isBackgroundmDeletingNow, setIsBackgroundDeletingNow] =
    useState(false);
  const [isDefaltProfileImg, setIsDefaltProfileImg] = useState(false);
  const [isDefaltBackgroundImg, setIsDefaltBackgroundImg] = useState(false);
  const [email, setEmail] = useState("taein071215@naver.com");
  const [isSwitched, setIsSwitched] = useState(false);
  const [isFalseSelected, setIsFalseSelected] = useState("selected");
  const [isTrueSelected, setIsTrueSelected] = useState("");
  const [isOpend, setIsopend] = useState(false);
  const [backgroundLocation, setBackgroundLocation] = useState(50);

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

  // 미트볼
  const modalRef = useRef();

  useEffect(() => {
    const clickOutside = (e) => {
      if (isOpend && !modalRef.current.contains(e.target)) {
        setIsopend(false);
      }
    };

    document.addEventListener("mousedown", clickOutside);

    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [isOpend]);

  const openMeatball = () => {
    setIsopend(!isOpend);
  };

  //---------------------------------------------------------------------

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

  const backgroundCheck = async () => {
    try {
      const backgroundImgRef = ref(storage, `background/${user?.uid}`);
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
      const profileImgRef = ref(storage, `avatars/${user?.uid}`);
      const avatarUrl = await getDownloadURL(ref(storage, profileImgRef));
      setIsDefaltProfileImg(false);
      setAvatar(avatarUrl);
    } catch (err) {
      setIsDefaltProfileImg(true);
    }
  };

  const emailAndBgLevelCheck = async () => {
    const docRef = doc(db, "users", `${user?.uid}`);
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

  const SwitchTrue = () => {
    setIsSwitched(true);
  };

  const SwitchFalse = () => {
    setIsSwitched(false);
  };

  //스위치 스테이트
  const onclick = () => {
    if (isFalseSelected === "selected") {
      setIsFalseSelected("");
    }
    if (isFalseSelected === "") {
      setIsFalseSelected("selected");
    }
    if (isTrueSelected === "selected") {
      setIsTrueSelected("");
    }
    if (isTrueSelected === "") {
      setIsTrueSelected("selected");
    }
  };

  //-----------------------

  //onLocationChange
  const onLocationChange = (e) => {
    setBackgroundLocation(Math.floor(e.target.value));
  };

  useEffect(() => {
    console.log(backgroundLocation);
  }, [backgroundLocation]);

  //--------------------------------------------------
  const navigate = useNavigate();
  const onClickBackPage = () => {
    navigate("/login");
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

  //마우스 떨어지면 bg level 저장
  const saveBgLevel = async () => {
    const docRef = doc(db, "users", user?.uid);
    await updateDoc(docRef, {
      backgroundLevel: backgroundLocation,
    });
  };

  //--------------------------------

  return (
    <Wrapper>
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
            <AvatarUploadBtn htmlFor="avatar">Edit</AvatarUploadBtn>
            <AvatarDeleteBtn onClick={onAvatarImgDelete}>
              Delete
            </AvatarDeleteBtn>
            {Boolean(!isDefaltProfileImg) ? (
              <AvatarImg src={avatar} />
            ) : (
              <AvatarImg src="public/user (1).svg"></AvatarImg>
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
            <Name>{user?.displayName ? user.displayName : "Anonymous"}</Name>
            {email ? <Email>{email}</Email> : null}
          </NameStuffCard>
        </LeftCard>
        <RightCard>
          <MeatBall>
            <MeatBallMenu onClick={openMeatball}></MeatBallMenu>
            {isOpend ? (
              <OpendMeatballMenu ref={modalRef}>
                <BackgroundHandle>
                  <BackgroundLocationBar
                    value={backgroundLocation}
                    onChange={onLocationChange}
                    type="range"
                    onMouseUp={saveBgLevel}
                  ></BackgroundLocationBar>

                  <BackgroundUploadBtn htmlFor="background">
                    Edit
                  </BackgroundUploadBtn>

                  <BackgroundDeleteBtn onClick={onBackgroundImgDelete}>
                    Delete
                  </BackgroundDeleteBtn>

                  <AccountDeleteBtn onClick={onDeleteAccount}>
                    Delete Acount
                  </AccountDeleteBtn>
                </BackgroundHandle>
              </OpendMeatballMenu>
            ) : null}
          </MeatBall>
        </RightCard>
      </Card>
      <UnderPage>
        <Switch>
          <SwitchBar>
            <FalseSwitchButton
              className={`${isFalseSelected}`}
              onClick={() => {
                SwitchFalse();
                onclick();
              }}
            >
              Posts
            </FalseSwitchButton>
            <TrueSwitchButton
              className={`${isTrueSelected}`}
              onClick={() => {
                SwitchTrue();
                onclick();
              }}
            >
              Liked
            </TrueSwitchButton>
          </SwitchBar>
          <ScrollDiv>
            {!isSwitched ? (
              <MyPosts userIdPram={`${user?.uid}`}></MyPosts>
            ) : (
              <MyLikes userIdPram={`${user?.uid}`}></MyLikes>
            )}
          </ScrollDiv>
        </Switch>
      </UnderPage>
    </Wrapper>
  );
}

// 타입스크립트 구문을 추가해줘. 코드의 모든 부분에.
