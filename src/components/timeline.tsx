import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import { Unsubscribe } from "firebase/auth";
import PostPreview from "./post-preview";

export interface IPost {
  id: string;
  photo?: string;
  post: string;
  userId: string;
  username: string;
  createdAt: number;
  hasPhoto: boolean;
  likesNumber: number;
  likesUserIdList: Array<String>;
  SavedUserList: Array<String>;
}

// const Wrapper = styled.div`
//   display: flex;
//   gap: 10px;
//   flex-direction: column;
//   overflow-y: scroll;
// `;

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  border-left: 3px solid #000000c8;
  border-right: 3px solid #000000c8;
`;

export default function Timeline() {
  const [post, setPost] = useState<IPost[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchPotsts = async () => {
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(50)
      );

      unsubscribe = await onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map((doc) => {
          const {
            post,
            hasPhoto,
            createdAt,
            userId,
            username,
            photo,
            likesNumber,
            likesUserIdList,
            SavedUserList,
          } = doc.data();
          return {
            post,
            hasPhoto,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
            likesNumber,
            likesUserIdList,
            SavedUserList,
          };
        });
        setPost(posts);
        console.log(posts);
      });
    };
    fetchPotsts();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Posts>
      {post.map((post) => (
        <PostPreview key={post.id} {...post} />
      ))}
    </Posts>
  );
}

// return (
//   <Wrapper>
//     {post.map((post) => (
//       <Post key={post.id} {...post} />
//     ))}
//   </Wrapper>
// );
