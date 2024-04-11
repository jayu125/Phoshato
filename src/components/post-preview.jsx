import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
`;

const WrapperLink = styled(NavLink)`
  padding: 15px 17px;
  display: grid;
  grid-template-columns: 1fr 8fr 1fr;
  /* background-color: #b1b1b144; */
  /* border-radius: 18px; */

  border-top: 2px solid #000000c8;
  width: 100%;
  min-height: 135px;
  text-decoration-line: none;
  color: #000000c8;

  &:hover {
    background-color: #b1b1b144;
    cursor: pointer;
  }
`;

const LeftSide = styled.div`
  min-height: 95px;
`;

const MiddleSide = styled.div`
  padding-left: 5px;
`;

const RightSide = styled.div`
  position: relative;
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
`;

const Username = styled.span`
  font-weight: 900;
  font-family: "Noto sans KR";
  font-size: 17px;
  user-select: none;
`;

const Payload = styled.p`
  margin: 5px 0px;
  font-size: 15px;
  font-family: "Noto Sans KR";
  font-weight: 700;
  user-select: none;
`;

const AvatarImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-left: 4px;
  user-select: none;
`;

const AvatarUpload = styled.label`
  width: 40px;
  height: 40px;
  display: inline-block;
`;

const Namebox = styled.div`
  height: 20px;
  display: flex;
  align-items: center;
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

const ImageLoadingImg = styled.img``;

export default function PostPreview({
  username,
  photo,
  post,
  userId,
  id,
  hasPhoto,
  likesNumber,
  likesUserIdList,
  SavedUserList,
}) {
  const user = auth.currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDetail, setUpdatedDetail] = useState("");
  const [isPoped, setIsPoped] = useState(false);
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [isDefaltProfileImg, setIsDefaltProfileImg] = useState(true);
  const [isOpend, setIsopend] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(false);
  const [isLikedPost, setIslikedPost] = useState("");
  const [isSavedPost, setIsSavedPost] = useState("");

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
    }
  };
  //----------------------------------------------------------------------

  //수정하기
  const onEdit = async () => {
    if (user?.uid !== userId) return;
    try {
      setIsEditing(true);
      setUpdatedDetail(post);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  //-------------------------------------------

  //포스트에 띄울 프로필 사진 체크

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

  //위에꺼 여기서 실행쓰
  useEffect(() => {
    fetchAvatar();
  }, []);

  const openMeatball = () => {
    setIsopend(true);
  };

  //------------------------------------

  // 기다리기 함수
  function wait(sec) {
    let start = Date.now(),
      now = start;
    while (now - start < sec * 1000) {
      now = Date.now();
    }
  }
  //----------------------
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
  //----------------------------------------------------------------------
  return (
    <Wrapper>
      <WrapperLink
        to={`/post-detail`}
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
        <LeftSide>
          <AvatarUpload>
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
          <Row>{hasPhoto && photo ? <Photo src={photo} /> : null}</Row>
        </MiddleSide>
        <RightSide></RightSide>
      </WrapperLink>
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
    </Wrapper>
  );
}
