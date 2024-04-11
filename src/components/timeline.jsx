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
import PostPreview from "./post-preview";

// const Wrapper = styled.div`
//   display: flex;
//   gap: 10px;
//   flex-direction: column;
//   overflow-y: scroll;
// `;

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 35px;
  width: 100%;
  z-index: 5;
`;

export default function Timeline() {
  const [post, setPost] = useState([]);

  useEffect(() => {
    let unsubscribe = null;
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
