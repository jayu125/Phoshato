import { sendPasswordResetEmail } from "firebase/auth";
import { Title, Button, Input, Error } from "../components/auth-components";
import { auth } from "../firebase";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { Link } from "react-router-dom";
import styled from "styled-components";

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setemail] = useState("");
  const [error, setError] = useState("");

  const Wrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 420px;
    padding: 100px 0px;
    user-select: none;
  `;

  const Switcher = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
  `;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setemail(value);
  };
  const onClick = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "") {
      setError("please type your email");
      return;
    }
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email); // await 키워드 추가
      console.log("Password reset email sent successfully!");
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>[ RESET PASSWORD ]</Title>
      <Input
        value={email}
        name="email"
        type="email"
        placeholder="type email for recive "
        onChange={onChange}
        style={{ marginTop: "40px" }}
      ></Input>
      {error !== "" ? <Error>{error}</Error> : null}{" "}
      <Switcher>
        <Link
          style={{
            color: "white",
            padding: "11px 10px",
            borderRadius: "50px",
            border: "none",
            width: "50%",
            fontSize: "16px",
            cursor: "pointer",
            textAlign: "left",
            textDecoration: "none",
            fontWeight: "bold",
          }}
          to="/login"
        >
          Login page &rarr;
        </Link>

        <Button onClick={onClick}>Send Reset Email</Button>
      </Switcher>
    </Wrapper>
  );
}
