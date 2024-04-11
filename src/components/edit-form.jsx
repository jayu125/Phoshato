import { deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const TextArea = styled.textarea`
  border: 2px solid #000000c8;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: #000000c8;
  background-color: white;
  width: 100%;
  resize: none;

  &::placeholder {
    font-size: 16px;
    font-family: --main-font-fammily, system-ui, -apple-system,
      BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
      "Open Sans", "Helvetica Neue", sans-serif;
  }
`;
const AttachFileButton = styled.label`
  padding: 10px 0;
  color: #000000c8;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #000000c8;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
`;
const AttachFileInput = styled.input`
  display: none;
`;

const DeleteFileInput = styled.input`
  display: none;
`;

const EditDoneButton = styled.input`
  background-color: #000000c8;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

const BtnDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;
const DeletePhotoButton = styled.label`
  padding: 10px 0;
  color: tomato;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #000000c8;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  min-width: 48%;
  margin-left: 4%;
  &.selected {
    color: white;
    background-color: #000000c8;
  }
`;
export default function EditForm({ postId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [updatedPost, setupdatedPost] = useState("");
  const [file, setFile] = useState(null);

  const [oldFile, setOldFile] = useState(false);
  const [hidePhoto, setHidePhoto] = useState(false);
  const [hideClassName, setHideClassName] = useState("");

  const onchange = (e) => {
    setupdatedPost(e.target.value);
  };
  const onFileChange = (e) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };

  const navigate = useNavigate();
  const onClickBackPage = () => {
    navigate("/");
  };

  useEffect(() => {
    const work = async () => {
      const docRef = doc(db, "posts", `${postId}`);
      const fetchedDoc = getDoc(docRef);
      const { post, photo } = (await fetchedDoc).data();
      setupdatedPost(post);
      if (photo) setOldFile(true);
    };
    work();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || updatedPost === "" || updatedPost.length > 400)
      return;
    if (hidePhoto) {
      setFile(null);
      const photoRef = ref(
        storage,
        `posts/${user.uid}-${user.displayName}/${postId}`
      );
      const docRef = doc(db, "posts", `${postId}`);
      await deleteObject(photoRef);
      await updateDoc(docRef, {
        hasPhoto: false,
        photo: deleteField(),
      });
    }

    try {
      setIsLoading(true);
      const docRef = doc(db, "posts", `${postId}`);
      const document = await updateDoc(docRef, {
        post: updatedPost,
        editedAt: Date.now(),
        hasPhoto: false,
      });
      if (file) {
        const locationRef = ref(
          storage,
          `posts/${user.uid}-${user.displayName}/${postId}`
        );
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(docRef, {
          hasPhoto: true,
          photo: url,
        });
      }
      setupdatedPost("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      onClickBackPage();
    }

    // setFile(imgUrl);
    //일단 여까지
    // await updateDoc(doc, {
    //   hasPhoto: true,
    //   photo: imgUrl,
    // });
  };

  const onDeletePhoto = () => {
    setHidePhoto(!hidePhoto);
    if (hidePhoto) {
      setHideClassName("");
    } else {
      setHideClassName("selected");
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={9}
        maxLength={400}
        onChange={onchange}
        value={updatedPost}
        placeholder="편집중..."
      />
      <BtnDiv>
        <AttachFileButton htmlFor="file">
          {file || oldFile ? "Photo added ✅" : "Add Photo"}
        </AttachFileButton>
        {file || oldFile ? (
          <DeletePhotoButton htmlFor="deleteFile" className={hideClassName}>
            {hidePhoto ? "get back 🔙" : "Delete photo 🗑️"}
          </DeletePhotoButton>
        ) : null}
        <AttachFileInput
          onChange={onFileChange}
          type="file"
          id="file"
          accept="image/*"
        />
        <DeleteFileInput id="deleteFile" onClick={onDeletePhoto} />
      </BtnDiv>
      <EditDoneButton
        value={isLoading ? "Posting..." : "Post Photo"}
        type="submit"
      />
    </Form>
  );
}
