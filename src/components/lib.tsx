/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import { FaSpinner } from "react-icons/fa";
import styled from "@emotion/styled/macro";

const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});
const Spinner = styled(FaSpinner)({
  animation: `${spin} 1s linear infinite`,
});

const fullPageSpinnerStyles = css({
  fontSize: "4em",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});
function FullPageSpinner() {
  return (
    <div css={fullPageSpinnerStyles}>
      <Spinner />
    </div>
  );
}

export { Spinner, FullPageSpinner };
