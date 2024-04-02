import styled from "styled-components";

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 100px 0px;
  user-select: none;
`;

export const Title = styled.h1`
  font-size: 42px;
  font-weight: bold;
  user-select: none;
`;

export const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 13px;
  width: 100%;
  user-select: none;
`;

export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Error = styled.span`
  font-weight: 600;
  color: tomato;
  margin-top: 30px;
`;

export const Switcher = styled.span`
  margin-top: 20px;
  a {
    color: white;
  }
  user-select: none;
`;

export const A = styled.a``;

export const Button = styled.button`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 42%;
  font-size: 16px;
  font-family: Pretendard-regular;
  font-weight: bold;

  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;
