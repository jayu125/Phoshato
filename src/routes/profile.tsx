import styled from "styled-components";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  display: flex;
  justify-content: center;
  svg {
    width: 50px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 20px;
`;

const ProfileImgDeleteBtn = styled.button`
  border: 2px solid black;
  background-color: white;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [isDeletingNow, setIsDeletingNow] = useState(false);
  const [isDefaltProfileImg, setIsDefaltProfileImg] = useState(false);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  useEffect(() => {
    profileCheck();
  }, []);
  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {Boolean(!isDefaltProfileImg) ? (
          <AvatarImg src={avatar} /> //false
        ) : (
          <AvatarImg src="../public/user.svg"></AvatarImg> //true
        )}
      </AvatarUpload>
      <AvatarInput
        id="avatar"
        type="file"
        accept="image/*"
        onChange={onAvatarChange}
      />
      <Name>{user?.displayName ? user.displayName : "Anonymous"}</Name>
      <ProfileImgDeleteBtn onClick={onAvatarImgDelete}>
        Delete Image
      </ProfileImgDeleteBtn>
      <span>{`현재 상태: ${isDefaltProfileImg}`}</span>
    </Wrapper>
  );
}
