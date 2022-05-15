/** @jsxImportSource @emotion/react */
import { CategoryType, useAllCategoriesQuery } from "generated/graphql";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { GraphQlError, Spinner } from "./lib";
import { css } from "@emotion/react";
import Card from "react-bootstrap/Card";

const categoryButton = css`
  padding: 5px;
  margin: 0 10px 10px 0;
`;

const wrapper = css`
  padding: 20px;
`;

export function Categories() {
  const {
    data: categories,
    error,
    loading: loadingCategories,
  } = useAllCategoriesQuery();

  if (loadingCategories) {
    return <Spinner />;
  }

  if (error) {
    return <GraphQlError error={error} />;
  }

  const active = categories?.allCategories.data.filter((c) => !c?.archived);
  const archived = categories?.allCategories.data.filter((c) => !!c?.archived);
  return (
    <div css={wrapper}>
      <Card>
        <Card.Header>Active</Card.Header>
        <Card.Body>
          {active?.map((c) => {
            return (
              <Link to={`/categories/${c?._id}`} key={c?._id}>
                <Button
                  key={c?._id}
                  css={categoryButton}
                  size="sm"
                  variant={
                    c?.type === CategoryType.Income
                      ? "outline-success"
                      : c?.type === CategoryType.Expense
                      ? "outline-danger"
                      : "outline-warning"
                  }
                >
                  {c?.title}
                </Button>
              </Link>
            );
          })}
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>Archived</Card.Header>
        <Card.Body>
          {archived?.map((c) => {
            return (
              <Link to={`/categories/${c?._id}`} key={c?._id}>
                <Button
                  key={c?._id}
                  css={categoryButton}
                  size="sm"
                  variant={
                    c?.type === CategoryType.Income
                      ? "outline-success"
                      : c?.type === CategoryType.Expense
                      ? "outline-danger"
                      : "outline-warning"
                  }
                >
                  {c?.title}
                </Button>
              </Link>
            );
          })}
        </Card.Body>
      </Card>
    </div>
  );
}
