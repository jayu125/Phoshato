import styled from "styled-components";
import { IPost } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 2px solid rgba(34, 34, 34, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Switcher = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: black;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: tomato;
  color: black;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
`;

const SaveButton = styled.button`
  background-color: tomato;
  color: black;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
`;

const EditingWindow = styled.textarea`
  padding: 15px 20px;
  border-radius: 15px;
  border: 1px solid rgba(34, 34, 34, 0.5);
  background-color: white;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  color: black;
  width: 100%;
  resize: none;
  &:focus {
    outline: none;
    border-color: tomato;
  }
`;

const CancelButton = styled.button`
  background-color: tomato;
  color: black;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
`;

export default function Post({ username, photo, post, userId, id }: IPost) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDetail, setUpdatedDetail] = useState("");

  const user = auth.currentUser;
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
  const onEdit = async () => {
    if (user?.uid !== userId) return;
    try {
      setIsEditing(true);
      setUpdatedDetail(post);

      // await deleteDoc(doc(db, "posts", id));
      // if (photo) {
      //   const photoRef = ref(storage, `posts/${user.uid}/${id}`);
      //   await deleteObject(photoRef);
      // }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUpdatedDetail(e.target.value);
  };

  const onSave = async () => {
    if (updatedDetail === "") {
      const ok = confirm(
        "포스트는 비어있을 수 없습니다. 포스트를 삭제하시겠습니까?"
      );
      if (ok === true) {
        onDelete();
        return;
      } else {
        return;
      }
    }
    const check = confirm("Are you suer to save your edited post?");
    if (!check || user?.uid !== userId) return;
    await updateDoc(doc(db, "posts", id), { post: `${updatedDetail}` });
    setIsEditing(false);
  };

  const onCancel = () => {
    setIsEditing(false);
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Switcher>
          {isEditing ? (
            <>
              <EditingWindow
                required
                rows={5}
                maxLength={200}
                onChange={onChange}
                value={updatedDetail}
                placeholder="what's happening?"
              />
              <SaveButton onClick={onSave}>Save</SaveButton>
              <CancelButton onClick={onCancel}>Cancel</CancelButton>
            </>
          ) : (
            <>
              <Payload>{post}</Payload>
              {user?.uid === userId ? (
                <>
                  <DeleteButton onClick={onDelete}>Delete</DeleteButton>
                  <EditButton onClick={onEdit}>Edit</EditButton>
                </>
              ) : null}
            </>
          )}
        </Switcher>
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
