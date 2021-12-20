/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import { FaSpinner } from "react-icons/fa";
import styled from "@emotion/styled/macro";
import * as colors from "styles/colors";
import type { ApolloError } from "@apollo/client";

const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

const Spinner = styled(FaSpinner)({
  animation: `${spin} 1s linear infinite`,
});

const GraphQlError = ({ error }: { error: ApolloError }) => {
  return <div>Oops, error happened. {JSON.stringify(error)}</div>;
};

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

const CircleButton = styled.button({
  borderRadius: "30px",
  padding: "0",
  width: "40px",
  height: "40px",
  lineHeight: "1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: colors.base,
  color: colors.text,
  border: `1px solid ${colors.gray10}`,
  cursor: "pointer",
});

export { GraphQlError, Spinner, FullPageSpinner, CircleButton };
