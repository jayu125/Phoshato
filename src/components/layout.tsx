import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";
import ReactModal from "react-modal";
import { useState } from "react";
import PostingForm from "./posting-form";

const Wrapper = styled.div`
  display: grid;
  gap: 60px;
  padding: 0px 0px;
  width: 100%;
  height: 100%;
  max-width: 1250px;
  grid-template-columns: 1fr 3fr 1.2fr;
`;
const Menu = styled.div`
  padding-top: 40px;
  padding-left: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
`;
const MenuItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid black;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  svg {
    width: 30px;
    fill: black;
  }
  &.log-out {
    border-color: tomato;
    svg {
      fill: tomato;
    }
  }
`;

const SideBar = styled.div`
  padding-top: 40px;
  display: flex;
  flex-direction: column;
`;
const InnerSideBar = styled.div`
  background-color: #ebebeb;
  border-radius: 15px;
  width: 90%;
  height: 80%;
`;

const Text = styled.span`
  font-size: 22px;
  font-weight: bold;
  color: black;
`;

const ForMidDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
`;

const StyeldLink = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding: 0 30% 0 10%;
  border-radius: 25px;
  text-decoration-line: none;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding: 0 30% 0 10%;
  border-radius: 25px;
  text-decoration-line: none;
  &:hover {
    background-color: #f1f1f1;
  }
  cursor: pointer;
`;

const NewPostButton = styled.div`
  height: 60px;
  width: 60px; //메뉴 크기랑 맞추기
  padding: 7px;
  border-radius: 50%;
  &:hover {
    background-color: #b1b1b144;
  }

  bottom: 0;
  right: 0px;

  background: none;
  border: none;

  background-size: cover;
  background-position: center;
  cursor: pointer;
  background-repeat: no-repeat;
  background-size: 50px;
  position: absolute;
`;

/*overlay는 모달 창 바깥 부분을 처리하는 부분이고,
content는 모달 창부분이라고 생각하면 쉬울 것이다*/
const customModalStyles: ReactModal.Styles = {
  overlay: {
    // backgroundColor: " rgba(0, 0, 0, 0.4)",
    width: "100%",
    height: "100vh",
    zIndex: "10",
    position: "fixed",
    top: "0",
    left: "0",
  },
  content: {
    zIndex: "150",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "20px",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
    backgroundColor: "white",
    justifyContent: "center",
    overflow: "auto",
  },
};

export default function Layout() {
  const [modalOpend, setModalOpend] = useState(false);
  const navigate = useNavigate();
  const onLogOut = async () => {
    const check = confirm("Are you sure to loging out?");
    if (check === true) {
      await auth.signOut();
      navigate("/login");
    }
  };
  const handleModalOpen = () => {
    setModalOpend(!modalOpend);
  };
  return (
    <>
      <Wrapper>
        <Menu>
          <StyeldLink
            to="/profile"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "#f1f1f1" } : null
            }
          >
            <MenuItem>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
              </svg>
            </MenuItem>
            <ForMidDiv>
              <Text>Profile</Text>
            </ForMidDiv>
          </StyeldLink>
          <StyeldLink
            to="/"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "#f1f1f1" } : null
            }
          >
            <MenuItem>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                  clipRule="evenodd"
                />
              </svg>
            </MenuItem>
            <ForMidDiv>
              <Text>Home</Text>
            </ForMidDiv>
          </StyeldLink>
          <StyeldLink
            to="/search"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "#f1f1f1" } : null
            }
          >
            <MenuItem>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                  clipRule="evenodd"
                />
              </svg>
            </MenuItem>
            <ForMidDiv>
              <Text>Search</Text>
            </ForMidDiv>
          </StyeldLink>
          <StyeldLink
            to="/my-posts"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "#f1f1f1" } : null
            }
          >
            <MenuItem>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </MenuItem>
            <ForMidDiv>
              <Text>List</Text>
            </ForMidDiv>
          </StyeldLink>
          <StyeldLink
            to="/saved"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "#f1f1f1" } : null
            }
          >
            <MenuItem>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 0 0 1.075.676L10 15.082l5.925 2.844A.75.75 0 0 0 17 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 2Z"
                  clipRule="evenodd"
                />
              </svg>
            </MenuItem>
            <ForMidDiv>
              <Text>Saved</Text>
            </ForMidDiv>
          </StyeldLink>
          <Div onClick={handleModalOpen}>
            <MenuItem>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
              </svg>
            </MenuItem>
            <NewPostButton></NewPostButton>

            <ForMidDiv>
              <Text>Post</Text>
            </ForMidDiv>
          </Div>
          <Div onClick={onLogOut}>
            <MenuItem className="log-out">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M14 10a.75.75 0 0 0-.75-.75H3.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 14 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </MenuItem>
            <ForMidDiv>
              <Text>Logout</Text>
            </ForMidDiv>
          </Div>
        </Menu>

        <Outlet />

        <SideBar></SideBar>
        <ReactModal
          style={customModalStyles}
          isOpen={modalOpend}
          onRequestClose={() => setModalOpend(false)}
        >
          <PostingForm />
        </ReactModal>
      </Wrapper>
    </>
  );
}
