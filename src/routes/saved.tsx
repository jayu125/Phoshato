import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { IPost } from "../components/timeline";
import Post from "../components/post";
import { Title } from "../components/auth-components";
import PostPreview from "../components/post-preview";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 35px;

  padding: 50px;
  padding-top: 100px;
  overflow: scroll;
  border-left: 3px solid #000000c8;
  border-right: 3px solid #000000c8;
`;

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  z-index: 5;
`;

const Header = styled.div`
  width: 646px;
  height: 55px;
  background-color: white;
  color: #000000c8;
  position: absolute;
  top: 25px;
  left: 48.3%;
  z-index: 100;
  padding-left: 47px;
  transform: translate(-50%, -50%);
  padding-top: 15px;
`;

const Text = styled.span`
  font-weight: 700;
  font-family: "Noto Sans KR";
  font-size: 40px;
  user-select: none;
`;

const BackgroundColor = styled.div`
  /* background-color: #b1b1b114; //임시임 */
`;

export default function MyPosts() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const user = auth.currentUser;
  const fetchPosts = async () => {
    const postQuery = query(
      collection(db, "posts"),
      where("SavedUserList", "array-contains", user?.uid),
      orderBy("createdAt", "desc"),
      limit(30)
    );
    const snapshot = await getDocs(postQuery);
    const posts = snapshot.docs.map((doc) => {
      const {
        post,
        createdAt,
        userId,
        username,
        photo,
        hasPhoto,
        likesNumber,
        likesUserList,
        SavedUserList,
      } = doc.data();
      return {
        post,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
        hasPhoto,
        likesNumber,
        likesUserList,
        SavedUserList,
      };
    });
    setPosts(posts);
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <Wrapper>
      <Header>
        <Text>저장된 글</Text>
      </Header>
      <Posts>
        {posts.map((post) => (
          <PostPreview key={post.id} {...post} />
        ))}
      </Posts>
      <h1 style={{ position: "absolute", top: "20%", zIndex: "2" }}>
        저장된 글이 없는 것 같아요...
      </h1>
    </Wrapper>
  );
}
