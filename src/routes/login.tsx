import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Error, Form, Switcher } from "../components/auth-components";
import GithubBtn from "../components/github-button";
import styled from "styled-components";

const Title = styled.p`
  font-size: 110px;
  letter-spacing: -5px;
  line-height: 90%;
  font-weight: 700;
  user-select: none;
  font-stretch: 100%;
  background-image: linear-gradient(
    160deg,
    #7aa9c9 0%,
    #316e6776 50%,
    #7aa9c9 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const WrapperLeft = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 45%;
  padding: 100px 0px 100px 100px;
  user-select: none;
  position: absolute;

  left: 0;
`;
const WrapperRight = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  padding: 200px 175px 100px 75px;
  user-select: none;
  position: absolute;

  right: 0;
`;

const Input = styled.input`
  padding: 15px 20px;
  border: none;
  border-radius: 10px;
  width: 100%;
  font-weight: bold;
  font-size: 17px;
  &[type="submit"] {
    cursor: pointer;
    opacity: 0.9;
    background: linear-gradient(
      -45deg,
      #ffa946a4,
      #fa5486ac,
      #5da1fa8b,
      #4cfcd397
    );
    background-size: 150%;
    animation: anime 16s linear infinite;
    &:hover {
      opacity: 0.75;
    }
  }
  &[type="text"],
  &[type="email"],
  &[type="password"] {
    background: linear-gradient(
      135deg,
      rgb(255, 255, 255),
      rgba(230, 230, 230, 0.548),
      rgba(184, 184, 184, 0.678)
    );
  }
`;

export default function CreateAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "password") {
      setPassword(value);
    } else if (name === "email") {
      setemail(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "" || password === "") return;
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <WrapperLeft>
        <Title style={{ fontStretch: "ultra-condensed" }}>
          LOG INTO PHOSHATO
        </Title>
      </WrapperLeft>
      <WrapperRight>
        <Form onSubmit={onSubmit}>
          <Input
            onChange={onChange}
            value={email}
            name="email"
            placeholder="email"
            type="email"
            required
          />
          <Input
            onChange={onChange}
            value={password}
            name="password"
            placeholder="password"
            type="password"
            required
          />
          <Input type="submit" value={isLoading ? "Loading..." : "Log in"} />
        </Form>
        {error !== "" ? <Error>{error}</Error> : null}
        <Switcher>
          Don't have an account?{" "}
          <Link to="/create-account" style={{ color: "black" }}>
            Let's Create
          </Link>
        </Switcher>
        <Switcher>
          forgot password?{" "}
          <Link to="/reset-password" style={{ color: "black" }}>
            reset password
          </Link>
        </Switcher>
        <GithubBtn />
      </WrapperRight>
    </>
  );
}
