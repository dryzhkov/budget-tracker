/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useAuth } from "../context/authProvider";
const styles = css({
  backgroundColor: "#282c34",
  minHeight: "50px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "calc(10px + 2vmin)",
  color: "white",
});
export function NavBar() {
  const { logout, isAuthenticated, login } = useAuth();

  const handleSignoutClick = () => logout();

  const handleLoginClick = () => login();

  return (
    <header css={styles}>
      {!isAuthenticated ? (
        <button onClick={handleLoginClick}>Sign In</button>
      ) : (
        <button onClick={handleSignoutClick}>Sign Out</button>
      )}
    </header>
  );
}
