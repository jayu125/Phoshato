import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Error, Switcher, Form } from "../components/auth-components";
import GithubBtn from "../components/github-button";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 75px;
  letter-spacing: 2px;
  line-height: 110%;
  font-weight: 900;
  user-select: none;
  font-stretch: ultra-condensed;
`;
const WrapperLeft = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 45%;
  padding: 100px 0px 200px 150px;
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
  width: 45%;
  padding: 200px 250px 150px 0px;
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
  font-size: 20px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export default function CreateAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setname(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "email") {
      setemail(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      setIsLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials.user);
      await updateProfile(credentials.user, { displayName: name });
      navigate("/");
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
    console.log(name, email, password);
  };
  return (
    <>
      <WrapperLeft>
        <Title>JOIN PHOSHATO</Title>
      </WrapperLeft>
      <WrapperRight>
        <Form onSubmit={onSubmit}>
          <Input
            onChange={onChange}
            value={name}
            name="name"
            placeholder="Name"
            type="text"
            required
          />
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
          <Input
            type="submit"
            value={isLoading ? "Loading..." : "Create Account"}
          />
        </Form>
        {error !== "" ? <Error>{error}</Error> : null}
        <Switcher>
          Already have an account? <Link to="/login">log in</Link>
        </Switcher>
        <GithubBtn />
      </WrapperRight>
    </>
  );
}
