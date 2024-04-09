import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Error, Switcher } from "../components/auth-components";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 110px;
  letter-spacing: -5px;
  line-height: 90%;
  font-weight: 500;
  user-select: none;
  font-stretch: 100%;
  background-image: linear-gradient(
    120deg,
    #000000 0%,
    #616161 35%,
    #000000 90%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  user-select: none;
  position: absolute;

  right: 0;
`;

const Form = styled.form`
  margin-top: 180px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 13px;
  width: 32%;
  min-width: 270px;
  user-select: none;
`;

const Input = styled.input`
  padding: 15px 20px;
  border: none;
  border-radius: 10px;
  width: 100%;
  min-width: 270px;
  max-width: 365px;

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

const Logo = styled.div`
  background-image: url("../src/assets/image/logo.png");
  background-size: cover;
  width: 100px;
  height: 100px;
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
    <div
      className="all"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <div
        className="Logo"
        style={{
          display: "flex",
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Logo></Logo>
        <Title style={{ margin: "0 0 0 10px" }}>Phoshato</Title>
      </div>

      <Wrapper>
        <Form onSubmit={onSubmit}>
          <div className="text-under-logo">
            <h1
              style={{
                fontSize: "53px",
                letterSpacing: "-5px",
                lineHeight: "90%",
                fontWeight: "500",
                userSelect: "none",
                fontStretch: "100%",
                margin: "0 0",
                marginBottom: "15px",
              }}
            >
              Create Account
            </h1>
          </div>
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
          Already have an account?{" "}
          <Link to="/login" style={{ color: "black" }}>
            log in
          </Link>
        </Switcher>
      </Wrapper>
    </div>
  );
}
