import { useState } from "react";
import { Box, AppBar, Toolbar, Button } from "@mui/material";
import { LoginState } from "../recoil/Auth";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu"; // 햄버거 아이콘
import { useRecoilState } from "recoil";
import useRequireLogin from "../hooks/useRequireLogin";
import logo from "@/assets/HYPE_VOICE_IMG.png";

const HeaderButtonComponent = styled(Button)`
  color: black;
  margin: 10px;
  align-self: center;
  white-space: nowrap;
  :hover {
    color: #268aff;
    opacity: 70%;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const HamburgerButtonComponent = styled(MenuIcon)`
  display: none;
  color: black;
  width: 100px;
  position: fixed;
  top: 10px;
  right: 0;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const LogoImg = styled.img`
  cursor: pointer;
  transition: opacity 0.3s ease, border 0.3s ease;
  border: 0 solid transparent;
  border-radius: 15%;

  &:hover {
    opacity: 0.6;
    border: 2px solid #5b5ff4;
  }
`;

export default function HeaderBarComponent() {
  // 로그인 여부
  const [loginState, setLoginState] = useRecoilState(LoginState);
  const navigation = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLoginState = () => {
    // 로그인 상태면 로그아웃 (확인 창 한 번 띄워서 의사 한 번 더 체크!)
    // 비로그인 상태면 로그인 페이지로 이동
    if (loginState) {
      if (window.confirm("정말로 로그아웃 하시겠습니까?")) {
        setLoginState(!loginState);
      }
    } else {
      navigation("/login");
    }
  };

  const navigateAndCloseMenu = (path: string) => {
    navigation(path);
    setMenuOpen(false);
  };

  const checkLoginAndNavigate = useRequireLogin();

  return (
    <Box
      sx={{ flexGrow: 1 }}
      style={{
        backgroundColor: "white",
        // borderBottom: "3px solid black",
      }}
    >
      <AppBar
        position="fixed"
        style={{
          backgroundColor: "white",
        }}
      >
        <Toolbar
          variant="dense"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
            width: "97%",
          }}
        >
          <div
            id="left"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
            }}
          >
            <LogoImg
              // src="../src/assets/HYPE_VOICE_IMG.png"
              src={logo}
              alt="HypeVoice Logo"
              onClick={() => navigation("/")}
              style={{ height: "50px", alignItems: "center" }}
            />
            {loginState && (
              <HeaderButtonComponent
                variant="text"
                onClick={() => checkLoginAndNavigate("/voice")}
              >
                내 보이스
              </HeaderButtonComponent>
            )}
            <HeaderButtonComponent
              variant="text"
              onClick={() => navigation("/community")}
            >
              게시판
            </HeaderButtonComponent>
            <HeaderButtonComponent
              variant="text"
              onClick={() => navigation("/studioList")}
            >
              스튜디오
            </HeaderButtonComponent>
          </div>
          <div
            id="right"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            {loginState && (
              <HeaderButtonComponent
                variant="text"
                onClick={() => checkLoginAndNavigate("/myPage")}
              >
                마이 페이지
              </HeaderButtonComponent>
            )}
            <HeaderButtonComponent variant="text" onClick={handleLoginState}>
              {loginState ? "로그아웃" : "로그인"}
            </HeaderButtonComponent>
            <HamburgerButtonComponent onClick={handleMenuClick} />
          </div>
          {/* /////////////////////////////////////////////////////////////////////// */}
          {menuOpen && (
            <div
              id="menu"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                backgroundColor: "white",
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* <div id="menu" style={{ position: "absolute", top: "100%", left: 0, width: "100%", backgroundColor: "white" }}> */}
              <Button
                variant="text"
                onClick={() => {
                  checkLoginAndNavigate("/voice");
                  setMenuOpen(false); // 메뉴를 닫습니다.
                }}
              >
                내 보이스
              </Button>
              <Button
                variant="text"
                onClick={() => navigateAndCloseMenu("/community")}
              >
                게시판
              </Button>
              <Button
                variant="text"
                onClick={() => navigateAndCloseMenu("/studioList")}
              >
                스튜디오
              </Button>
              {loginState && (
                <Button
                  variant="text"
                  // onClick={() => checkLoginAndNavigate("/myPage")}
                  onClick={() => {
                    checkLoginAndNavigate("/myPage");
                    setMenuOpen(false); // 메뉴를 닫습니다.
                  }}
                >
                  마이 페이지
                </Button>
              )}
              <Button variant="text" onClick={handleLoginState}>
                {loginState ? "로그아웃" : "로그인"}
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
