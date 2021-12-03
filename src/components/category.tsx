import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "generated/graphql";
import { useParams } from "react-router-dom";
import { GraphQlError, Spinner } from "./lib";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

export function Category() {
  const { categoryId } = useParams();

  const {
    data: result,
    error,
    loading: loadingCategories,
  } = useGetCategoryByIdQuery({
    variables: { id: categoryId ?? "" },
    skip: !categoryId,
  });

  const { findCategoryByID: category } = result ?? {};

  const [updateCategoryMutation, { error: updateCategoryErr }] =
    useUpdateCategoryMutation({
      refetchQueries: ["GetCategoryById"],
    });

  if (loadingCategories) {
    return <Spinner />;
  }

  if (error) {
    return <GraphQlError error={error} />;
  }

  if (!category) {
    return null;
  }

  const handleArchivedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.checked);
    updateCategoryMutation({
      variables: {
        id: category._id,
        data: {
          title: category.title,
          type: category.type,
          externalUrl: category.externalUrl,
          archived: event.target.checked,
        },
      },
    });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  };

  const handleExternalUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.value);
  };

  return (
    <>
      <FloatingLabel controlId="floatingTitle" label="Title" className="mb-3">
        <Form.Control
          type="text"
          value={category.title}
          onChange={handleTitleChange}
        />
      </FloatingLabel>
      <FloatingLabel controlId="floatingUrl" label="External URL">
        <Form.Control
          type="text"
          value={category.externalUrl ?? ""}
          onChange={handleExternalUrlChange}
        />
      </FloatingLabel>
      <Form.Check
        type="checkbox"
        onChange={handleArchivedChange}
        checked={category.archived}
        label="Archived?"
      />
    </>
  );
}
