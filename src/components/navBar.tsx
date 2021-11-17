/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

import { useAuth } from "../context/authProvider";
const styles = css({
  paddingLeft: "20px",
});
export function NavBar() {
  const { logout, isAuthenticated, login } = useAuth();

  const handleSignoutClick = () => logout();

  const handleLoginClick = () => login();

  return (
    <Navbar css={styles} collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand as={Link} to="/">
        Budget Tracker
      </Navbar.Brand>
      <Nav>
        {!isAuthenticated ? (
          <Nav.Link onClick={handleLoginClick}>Sign in</Nav.Link>
        ) : (
          <>
            <Nav.Link as={Link} to="/categories">
              Categories
            </Nav.Link>
            <Nav.Link as={Link} to="/charts">
              Charts
            </Nav.Link>
            <Nav.Link onClick={handleSignoutClick}>Sign out</Nav.Link>
          </>
        )}
      </Nav>
    </Navbar>
  );
}
