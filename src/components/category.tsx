/** @jsxImportSource @emotion/react */
import {
  PaymentFrequency,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "generated/graphql";
import { useParams } from "react-router-dom";
import { GraphQlError, Spinner } from "./lib";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { css } from "@emotion/react";
import { useEffect, useState } from "react";

let mutationTimeout: ReturnType<typeof setTimeout>;
const MUTATION_TIMOUT_DELAY = 1000;

const wrapper = css`
  padding: 20px;
`;

export function Category() {
  const { categoryId } = useParams();

  const [toastText, setToastText] = useState<string | undefined>();
  const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency>(
    PaymentFrequency.Biweekly
  );

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

  useEffect(() => {
    if (
      !!category?.paymentFrequency &&
      paymentFrequency !== category?.paymentFrequency
    ) {
      setPaymentFrequency(category?.paymentFrequency);
    }
  }, [category?.paymentFrequency, paymentFrequency]);

  if (loadingCategories) {
    return <Spinner />;
  }

  if (error) {
    return <GraphQlError error={error} />;
  }

  if (!category) {
    return null;
  }

  if (updateCategoryErr) {
    setToastText("Error while updating category");
  }

  const handleArchivedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateCategoryMutation({
      variables: {
        id: category._id,
        data: {
          title: category.title,
          type: category.type,
          externalUrl: category.externalUrl,
          archived: event.target.checked,
          paymentFrequency: category.paymentFrequency,
        },
      },
    });
    setToastText("Saved");
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (mutationTimeout) {
      clearTimeout(mutationTimeout);
    }
    mutationTimeout = setTimeout(() => {
      updateCategoryMutation({
        variables: {
          id: category._id,
          data: {
            title: event.target.value,
            type: category.type,
            archived: category.archived,
            paymentFrequency: category.paymentFrequency,
          },
        },
      });

      setToastText("Saved");
    }, MUTATION_TIMOUT_DELAY);
  };

  const handleExternalUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (mutationTimeout) {
      clearTimeout(mutationTimeout);
    }
    mutationTimeout = setTimeout(() => {
      updateCategoryMutation({
        variables: {
          id: category._id,
          data: {
            title: category.title,
            type: category.type,
            archived: category.archived,
            externalUrl: event.target.value,
            paymentFrequency: category.paymentFrequency,
          },
        },
      });
      setToastText("Saved");
    }, MUTATION_TIMOUT_DELAY);
  };

  const handleFrequencyChange = (frequency: PaymentFrequency) => {
    updateCategoryMutation({
      variables: {
        id: category._id,
        data: {
          title: category.title,
          type: category.type,
          externalUrl: category.externalUrl,
          archived: category.archived,
          paymentFrequency: frequency,
        },
      },
    });
    setPaymentFrequency(frequency);
    setToastText("Saved");
  };

  return (
    <div css={wrapper}>
      <ToastContainer className="p-3" position="bottom-center">
        <Toast
          show={!!toastText}
          onClose={() => setToastText(undefined)}
          delay={3000}
          autohide
        >
          <Toast.Header>{toastText}</Toast.Header>
        </Toast>
      </ToastContainer>
      <FloatingLabel controlId="floatingTitle" label="Title" className="mb-3">
        <Form.Control
          type="text"
          defaultValue={category.title}
          onChange={handleTitleChange}
        />
      </FloatingLabel>
      <FloatingLabel controlId="floatingUrl" label="External URL">
        <Form.Control
          type="text"
          defaultValue={category.externalUrl ?? ""}
          onChange={handleExternalUrlChange}
        />
      </FloatingLabel>
      <Form.Check
        type="checkbox"
        onChange={handleArchivedChange}
        checked={category.archived}
        label="Archived?"
      />

      <ButtonGroup>
        <Button
          variant="secondary"
          disabled={paymentFrequency === PaymentFrequency.Biweekly}
          onClick={() => handleFrequencyChange(PaymentFrequency.Biweekly)}
        >
          Biweekly
        </Button>
        <Button
          variant="secondary"
          disabled={paymentFrequency === PaymentFrequency.Monthly}
          onClick={() => handleFrequencyChange(PaymentFrequency.Monthly)}
        >
          Monthly
        </Button>
        <Button
          variant="secondary"
          disabled={paymentFrequency === PaymentFrequency.Bimontly}
          onClick={() => handleFrequencyChange(PaymentFrequency.Bimontly)}
        >
          Bimonthly
        </Button>
        <Button
          variant="secondary"
          disabled={paymentFrequency === PaymentFrequency.Quarterly}
          onClick={() => handleFrequencyChange(PaymentFrequency.Quarterly)}
        >
          Quarterly
        </Button>
        <Button
          variant="secondary"
          disabled={paymentFrequency === PaymentFrequency.Other}
          onClick={() => handleFrequencyChange(PaymentFrequency.Other)}
        >
          Other
        </Button>
      </ButtonGroup>
    </div>
  );
}
