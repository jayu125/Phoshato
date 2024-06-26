import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useRef, useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { getDoc, updateDoc } from "firebase/firestore";
import ReactModal from "react-modal";
import EditForm from "../components/edit-form";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 135px;
  flex-direction: column;
  border-left: 3px solid #000000c8;
  border-right: 3px solid #000000c8;
`;

const PostWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 8fr 1fr;
  width: 100%;
  min-height: 135px;
  color: #000000c8;
  padding: 15px 17px;
  border-top: 3px solid #000000c8;
`;

const LeftSide = styled.div`
  min-height: 95px;
`;

const MiddleSide = styled.div`
  overflow: scroll;
  padding-left: 5px;
  width: 100%;
`;

const RightSide = styled.div`
  position: relative;
`;

const AvatarImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-left: 4px;
  user-select: none;
  &:hover {
    background-color: #b1b1b144;
  }
`;

const AvatarUpload = styled(NavLink)`
  width: 40px;
  height: 40px;
  display: inline-block;
`;

const Payload = styled.p`
  width: 100%;
  margin: 7px 0px;
  font-size: 15px;
  font-family: "Noto Sans KR";
  font-weight: 500;
  user-select: none;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 10px 0;
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  user-select: none;
  border-radius: 15px;
`;

const Namebox = styled.div`
  height: 20px;
  display: flex;
  align-items: center;
`;

const Username = styled.span`
  font-weight: 900;
  font-family: "Noto sans KR";
  font-size: 17px;
  user-select: none;
`;

const MeatBallMenu = styled.button`
  border: 0;
  width: 37px;
  height: 37px;
  background: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' class='w-6 h-6'%3E%3Cpath fill-rule='evenodd' d='M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z' clip-rule='evenodd' /%3E%3C/svg%3E%0A");
  border-radius: 50%;
  position: absolute;
  left: 55%;
  top: 15px;
  transform: translate(-50%, -50%);

  cursor: pointer;
  &:hover {
    background-color: #f1f1f1;
  }
`;
const OpendMeatballMenu = styled.div`
  background-color: #ffffff;
  width: 70px;
  height: 70px;
  border-radius: 18px;
  position: absolute;
  top: 35px;
  overflow: hidden;
  box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.12);
`;

const DeleteButton = styled.button`
  background-color: white;
  color: black;
  font-weight: 600;
  width: 100%;
  height: 50%;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  cursor: pointer;
  &:hover {
    background-color: #000000c8;
    color: white;
  }
`;

const EditButton = styled.button`
  background-color: white;
  color: black;
  font-weight: 600;
  width: 100%;
  height: 50%;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  cursor: pointer;
  &:hover {
    background-color: #000000c8;
    color: white;
  }
`;

const UpperBar = styled.div`
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

const UnderBar = styled.div`
  width: 100%;
  height: 55px;
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 10px;
  gap: 10px;
`;

const LikeButton = styled.button`
  height: 45px;
  width: 45px;
  padding: 7px;
  border-radius: 50%;

  &:hover {
    background-color: #b1b1b144;
  }

  background: none;
  border: none;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>');
  &.likedClass {
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>');
  }

  background-size: cover;
  background-position: center;
  cursor: pointer;
  background-size: 90%;
`;
const CommentsButton = styled.button`
  height: 45px;
  width: 45px;
  padding: 7px;
  border-radius: 50%;

  &:hover {
    background-color: #b1b1b144;
  }

  background: none;
  border: none;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>');
  background-size: cover;
  background-position: center;
  background-size: 90%;
  cursor: pointer;
`;
const SaveButton = styled.button`
  height: 45px;
  width: 45px;
  padding: 7px;
  border-radius: 50%;

  &:hover {
    background-color: #b1b1b144;
  }

  position: absolute;
  right: 10px;

  background: none;
  border: none;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>');
  &.savedClass {
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" /></svg>');
  }

  background-size: cover;
  background-position: center;
  cursor: pointer;
  background-size: 90%;
`;

const customModalStyles = {
  overlay: {
    // backgroundColor: " rgba(0, 0, 0, 0.4)",
    width: "100%",
    height: "100vh",
    zIndex: "10",
    position: "fixed",
    top: "0",
    left: "0",
  },
  content: {
    zIndex: "150",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "20px",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
    backgroundColor: "white",
    justifyContent: "center",
    overflow: "auto",
  },
};

export default function PostDetail() {
  const user = auth.currentUser;
  const location = useLocation();
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
  } = location.state; //정보 전달받기
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [isDefaltProfileImg, setIsDefaltProfileImg] = useState(true);
  const [isOpend, setIsopend] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLikedPost, setIslikedPost] = useState("");
  const [isSavedPost, setIsSavedPost] = useState("");
  const [modalOpend, setModalOpend] = useState(false);

  const navigate = useNavigate();
  const onClickBackPage = () => {
    navigate(-1);
  };

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

  //지우기
  const onDelete = async () => {
    const check = confirm("Are you sure to delete the post?");
    if (!check || user?.uid !== userId) {
      return;
    }
    try {
      await deleteDoc(doc(db, "posts", id));
      if (photo) {
        const photoRef = ref(storage, `posts/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (err) {
      console.log(err);
    } finally {
      onClickBackPage();
    }
  };
  //----------------------------------------------------------------------

  //수정하기
  const onEdit = async () => {
    if (user?.uid !== userId) return;
    try {
      setIsEditing(true);
      handleModalOpen();
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  //미트볼 모달 바깥 클릭 시 팝업 해제

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
    setIsopend(true);
  };

  // --------------------------------------------------------------------
  //좋아요버튼

  async function handleLike(id) {
    //포스트id 를 인수로 받아옴
    const user = auth.currentUser;
    const docRef = doc(db, "posts", `${id}`);
    const fetchedDoc = getDoc(docRef);
    const { likesUserList } = (await fetchedDoc).data();

    const likedList = likesUserList; //likedUserList 컬랙션

    if (likedList.includes(`${user?.uid}`)) {
      setIslikedPost("");
      const findIndex = likedList.indexOf(`${user.uid}`);

      if (findIndex > -1) {
        likedList.splice(findIndex, 1);
      }

      await updateDoc(docRef, {
        likesUserList: likedList,
      });
    } else {
      setIslikedPost("likedClass");
      likedList.push(`${user?.uid}`);

      await updateDoc(docRef, {
        likesUserList: likedList,
      });
    }
  }

  useEffect(() => {
    const working = async () => {
      const user = auth.currentUser;
      const docRef = doc(db, "posts", `${id}`);
      const fetchedDoc = getDoc(docRef);
      const { likesUserList } = (await fetchedDoc).data();

      const likedList = likesUserList; //likedUserList 컬랙션
      if (likedList.includes(`${user?.uid}`)) {
        setIslikedPost("likedClass");
      } else {
        setIslikedPost("");
      }
    };
    working();
  }, []);

  //------------------

  //저장 버튼
  async function handleSave(id) {
    //포스트id 를 인수로 받음

    const user = auth.currentUser;
    const docRef = doc(db, "posts", `${id}`);
    const fetchedDoc = getDoc(docRef);
    const { SavedUserList } = (await fetchedDoc).data();

    const savedList = SavedUserList; //likedUserList 컬랙션

    if (savedList.includes(`${user?.uid}`)) {
      setIsSavedPost("");
      const findIndex = savedList.indexOf(`${user.uid}`);

      if (findIndex > -1) {
        savedList.splice(findIndex, 1);
      }

      await updateDoc(docRef, {
        SavedUserList: savedList,
      });
    } else {
      setIsSavedPost("savedClass");
      savedList.push(`${user?.uid}`);

      await updateDoc(docRef, {
        SavedUserList: savedList,
      });
    }
  }

  useEffect(() => {
    const working = async () => {
      const user = auth.currentUser;
      const docRef = doc(db, "posts", `${id}`);
      const fetchedDoc = getDoc(docRef);
      const { SavedUserList } = (await fetchedDoc).data();

      const savedList = SavedUserList; //likedUserList 컬랙션
      if (savedList.includes(`${user?.uid}`)) {
        setIsSavedPost("savedClass");
      } else {
        setIsSavedPost("");
      }
    };
    working();
  }, []);

  //------------------

  const handleModalOpen = () => {
    setModalOpend(!modalOpend);
  };

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
        <Title>{username}'s post</Title>
      </UpperBar>
      <PostWrapper>
        <LeftSide>
          <AvatarUpload
            to={"/user-profile"}
            state={{
              username: username,
              photo: photo,
              post: post,
              userId: userId,
              id: id,
              hasPhoto: hasPhoto,
              likesNumber: likesNumber,
              likesUserIdList: likesUserIdList,
              SavedUserList: SavedUserList,
            }}
          >
            {isDefaltProfileImg ? (
              <AvatarImg src='data:image/svg+xml,<%3Fxml version="1.0" encoding="UTF-8"%3F><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="165px" height="165px" viewBox="0 0 165 165" version="1.1"><g id="surface1"><path style=" stroke:rgb(100%,100%,100%);fill-rule:evenodd;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 128.460938 131.292969 C 141.925781 118.640625 149.550781 100.976562 149.53125 82.5 C 149.53125 45.476562 119.523438 15.46875 82.5 15.46875 C 45.476562 15.46875 15.46875 45.476562 15.46875 82.5 C 15.449219 100.976562 23.074219 118.640625 36.539062 131.292969 C 48.964844 143.027344 65.410156 149.554688 82.5 149.53125 C 99.589844 149.554688 116.035156 143.027344 128.460938 131.292969 Z M 42.246094 122.457031 C 52.023438 110.226562 66.839844 103.109375 82.5 103.125 C 98.160156 103.109375 112.976562 110.226562 122.753906 122.457031 C 112.117188 133.203125 97.617188 139.238281 82.5 139.21875 C 67.382812 139.238281 52.882812 133.203125 42.246094 122.457031 Z M 108.28125 61.875 C 108.28125 76.113281 96.738281 87.65625 82.5 87.65625 C 68.261719 87.65625 56.71875 76.113281 56.71875 61.875 C 56.71875 47.636719 68.261719 36.09375 82.5 36.09375 C 96.738281 36.09375 108.28125 47.636719 108.28125 61.875 Z M 108.28125 61.875 "/></g></svg>' />
            ) : (
              <AvatarImg src={avatar} />
            )}
          </AvatarUpload>
        </LeftSide>
        <MiddleSide>
          <>
            <Namebox>
              <Username>{username}</Username>
            </Namebox>
            <Payload>{post}</Payload>
          </>
          <Row>{photo ? <Photo src={photo} /> : null}</Row>
        </MiddleSide>
        <RightSide>
          {user?.uid === userId ? (
            <>
              <MeatBallMenu onClick={openMeatball}></MeatBallMenu>
              {isOpend ? (
                <OpendMeatballMenu ref={modalRef}>
                  <DeleteButton onClick={onDelete}>Delete</DeleteButton>
                  <EditButton onClick={onEdit}>Edit</EditButton>
                </OpendMeatballMenu>
              ) : null}
            </>
          ) : null}
        </RightSide>
      </PostWrapper>
      <UnderBar>
        <LikeButton
          className={`${isLikedPost}`}
          onClick={() => {
            handleLike(id);
          }}
        ></LikeButton>
        <CommentsButton></CommentsButton>
        <SaveButton
          className={`${isSavedPost}`}
          onClick={() => {
            handleSave(id);
          }}
        ></SaveButton>
      </UnderBar>
      <ReactModal
        style={customModalStyles}
        isOpen={modalOpend}
        onRequestClose={() => setModalOpend(false)}
      >
        <EditForm postId={id} />
      </ReactModal>
    </Wrapper>
  );
}
