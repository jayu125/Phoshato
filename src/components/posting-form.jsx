import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
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
`;
const AttachFileInput = styled.input`
  display: none;
`;
const SubmitButton = styled.input`
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

export default function PostingForm() {
  const [isLoading, setLoading] = useState(false);
  const [post, setPost] = useState("");
  const [file, setFile] = useState(null);

  const onchange = (e) => {
    setPost(e.target.value);
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

  const onSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || post === "" || post.length > 400) return;

    try {
      setLoading(true);
      const doc = await addDoc(collection(db, "posts"), {
        post,
        createdAt: Date.now(),
        username: user.displayName || "익명",
        userId: user.uid,
        hasPhoto: false,
        likesNumber: 0,
        likesUserList: [],
        SavedUserList: [],
      });
      if (file) {
        const locationRef = ref(
          storage,
          `posts/${user.uid}-${user.displayName}/${doc.id}`
        );
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          hasPhoto: true,
          photo: url,
        });
      }
      setPost("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      onClickBackPage();
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={9}
        maxLength={400}
        onChange={onchange}
        value={post}
        placeholder="사진에 대한 얘기를 !"
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo added ✅" : "Add Photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitButton
        value={isLoading ? "Posting..." : "Post Photo"}
        type="submit"
      />
    </Form>
  );
}
