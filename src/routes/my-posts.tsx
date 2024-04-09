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
  gap: 20px;
  padding: 10px;

  border-left: 3px solid #000000c8;
  border-right: 3px solid #000000c8;
`;

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
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
      where("userId", "==", user?.uid),
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
    <BackgroundColor>
      <Wrapper>
        <Title>내 글</Title>
        <Posts>
          {posts.map((post) => (
            <PostPreview key={post.id} {...post} />
          ))}
        </Posts>
      </Wrapper>
    </BackgroundColor>
  );
}
