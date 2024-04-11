import styled from "styled-components";
import MyPosts from "./my-posts";
import { auth } from "../firebase";

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

const Text = styled.span`
  font-weight: 700;
  font-family: "Noto Sans KR";
  font-size: 40px;
  user-select: none;
`;

export default function MyPostsPage() {
  const user = auth.currentUser;
  return (
    <Wrapper>
      <Header>
        <Text>내 글</Text>
      </Header>
      <MyPosts userIdPram={`${user?.uid}`} />
    </Wrapper>
  );
}
