import styled from "styled-components";
import PostingForm from "../components/posting-form";
import Timeline from "../components/timeline";
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

export default function Home() {
  return (
    <>
      <Wrapper>
        <Header>
          <Text>Home</Text>
        </Header>
        <Timeline />
      </Wrapper>
    </>
  );
}
