import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Spinner } from "./lib";
const CATEGORIES_QUERY = gql`
  {
    allCategories {
      data {
        _id
        archived
        title
        type
      }
    }
  }
`;

export function Categories() {
  const { data: results, loading, error } = useQuery(CATEGORIES_QUERY);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Oops, error happened. {JSON.stringify(error)}</div>;
  }

  return (
    <ul>
      {results.allCategories.data.map((item: any) => {
        return <li key={item._id}>{item.title}</li>;
      })}
    </ul>
  );
}
