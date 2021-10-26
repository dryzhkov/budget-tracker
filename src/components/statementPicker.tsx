import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Spinner } from "./lib";

const STATEMENTS_BY_YEAR = gql`
  {
    statementsByYear(year: "2020") {
      data {
        _id
        date
        transactions {
          _id
          amount
          category {
            archived
            externalUrl
            type
            title
          }
        }
      }
    }
  }
`;

export function StatementPicker() {
  const { data: results, loading, error } = useQuery(STATEMENTS_BY_YEAR);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Oops, error happened. {JSON.stringify(error)}</div>;
  }

  return (
    <ul>
      {results.statementsByYear.data.map((item: any) => {
        return <li key={item._id}>{item.date}</li>;
      })}
    </ul>
  );
}
