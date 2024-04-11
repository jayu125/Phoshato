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

import PostPreview from "../components/post-preview";

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  overflow: scroll;
`;

const BackgroundColor = styled.div`
  /* background-color: #b1b1b114; //임시임 */
`;

export default function MyLikes({ userIdPram }) {
  const [posts, setPosts] = useState([]);
  const user = auth.currentUser;
  const fetchPosts = async () => {
    const postQuery = query(
      collection(db, "posts"),
      where("likesUserList", "array-contains", userIdPram),
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
    <Posts>
      {posts.map((post) => (
        <PostPreview key={post.id} {...post} />
      ))}
      <h1 style={{ position: "absolute", zIndex: "-1", marginTop: "20px" }}>
        아직 좋아요 한 글이 없는 것 같아요...
      </h1>
    </Posts>
  );
}
