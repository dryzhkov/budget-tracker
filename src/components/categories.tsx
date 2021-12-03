import { CategoryType, useAllCategoriesQuery } from "generated/graphql";
import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";
import { GraphQlError, Spinner } from "./lib";

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
  return (
    <ListGroup as="ul">
      {categories?.allCategories.data.map((category) => {
        return (
          <ListGroup.Item
            as="li"
            key={category?._id}
            action
            variant={
              category?.type === CategoryType.Expense
                ? "danger"
                : category?.type === CategoryType.Income
                ? "success"
                : "warning"
            }
          >
            <Link to={`/categories/${category?._id}`}>{category?.title}</Link>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}
