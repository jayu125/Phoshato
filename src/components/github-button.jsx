import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Button = styled.button`
  background-color: white;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 50px;
  border: 2px solid black;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  color: black;
  width: 100%;
  margin-top: 50px;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: white;
    background-color: black;
  }
`;

const Logo = styled.img`
  height: 25px;
  user-select: none;
`;

export default function GithubBtn() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/github-logo.svg"></Logo>
      continue with github
    </Button>
  );
}
