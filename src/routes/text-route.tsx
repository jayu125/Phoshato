import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { IPost } from "../components/timeline";
import styled from "styled-components";
import PostPreview from "../components/post-preview";

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  border-left: 3px solid #000000c8;
  border-right: 3px solid #000000c8;
`;

export default function Test() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const fetchPosts = async () => {
    const postQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const snapshot = await getDocs(postQuery);
    const posts = snapshot.docs.map((doc) => {
      const { post, createdAt, userId, username, photo } = doc.data();
      return { post, createdAt, userId, username, photo, id: doc.id };
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
    </Posts>
  );
}

// id: string;
// photo?: string;
// post: string;
// userId: string;
// username: string;
// createdAt: number;
