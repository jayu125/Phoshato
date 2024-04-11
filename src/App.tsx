import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";
import ProtectedRoute from "./components/protected-route";
import ResetPassword from "./routes/reset-password";
import Search from "./routes/search";
import MyPosts from "./routes/my-posts";
import Test from "./routes/text-route";
import Saved from "./routes/saved";
import PostDetail from "./routes/post-detail";
import MyPostsPage from "./routes/my-post-route";
import MakeProfilePage from "./components/makeProfilePage";

const GlobalStyle = createGlobalStyle`

  --main-font-family: Pretendard-regular;
  ${reset}
  &::-webkit-scrollbar {
  display: none;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    font-family: --main-font-family, system-ui, -apple-system,
      BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
      "Open Sans", "Helvetica Neue", sans-serif;
  }
  body{
    background-color: white;
    color: black;
    font-family:Pretendard-regular, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  @font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
}
`;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "my-posts",
        element: <MyPostsPage />,
      },
      {
        path: "test-page",
        element: <Test />,
      },
      {
        path: "saved",
        element: <Saved />,
      },
      {
        path: "post-detail",
        element: <PostDetail />,
      },
      {
        path: "user-profile",
        element: <MakeProfilePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  position: relative;
  justify-content: center;
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <Wrapper>
        <GlobalStyle />
        {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
      </Wrapper>
    </>
  );
}

export default App;
