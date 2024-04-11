import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useRef, useState } from "react";
import { DocumentData, deleteDoc, doc } from "firebase/firestore";
import handleLike from "../components/Like-and-dislike";
import { collection, getDoc, updateDoc } from "firebase/firestore";
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
  background-image: url("public/likes.svg");
  &.likedClass {
    background-image: url("public/liked.svg");
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
  background-image: url("public/comments.svg");
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
  background-image: url("public/save.svg");
  &.savedClass {
    background-image: url("public/saved.svg");
  }

  background-size: cover;
  background-position: center;
  cursor: pointer;
  background-size: 90%;
`;

const customModalStyles: ReactModal.Styles = {
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
    const clickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
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

  async function handleLike(id: string) {
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
  async function handleSave(id: string) {
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
              <AvatarImg src="../public/user.svg" />
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
