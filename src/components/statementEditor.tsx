import {
  Category,
  CategoryType,
  Transaction,
  useAllCategoriesQuery,
  useCreateStatementMutation,
  useCreateTransactionMutation,
  useDeleteStatementMutation,
  useDeleteTransactionMutation,
  useGetStatementByIdQuery,
  useUpdateTransactionMutation,
} from "generated/graphql";
import { dateToString } from "utils/dates";
import { Spinner } from "./lib";
import { StatementDto } from "./statementPicker";

import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import { useEffect, useRef, useState } from "react";
interface StatementEditorProps {
  statement: StatementDto;
  setSelectedStatement: (value: StatementDto | null) => void;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function StatementEditor({
  statement,
  setSelectedStatement,
}: StatementEditorProps) {
  const {
    data,
    loading: loadingStatement,
    error,
  } = useGetStatementByIdQuery({
    variables: { id: statement?.id ?? "" },
    skip: !statement.id,
  });

  const { data: results, loading: loadingCategories } = useAllCategoriesQuery();
  const [showPopover, setShowPopover] = useState(false);
  const [target, setTarget] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [createStatementMutation, { error: createStatementErr }] =
    useCreateStatementMutation({
      refetchQueries: ["GetStatementsByYear"],
    });

  const [deleteStatementMutation, { error: deleteStatementErr }] =
    useDeleteStatementMutation({
      refetchQueries: ["GetStatementsByYear"],
    });

  const [createTransactionMutation, { error: createTransactionErr }] =
    useCreateTransactionMutation({
      refetchQueries: ["GetStatementById"],
    });

  const [updateTransactionMutation, { error: updateTransactionErr }] =
    useUpdateTransactionMutation({
      refetchQueries: ["GetStatementById"],
    });

  const [deleteTransactionMutation, { error: deleteTransactionErr }] =
    useDeleteTransactionMutation({
      refetchQueries: ["GetStatementById"],
    });

  const [amount, setAmount] = useState<number>(0);

  const prevTargetRef = useRef(null);

  const handleClick = (
    event: any,
    category: Category | null,
    transaction: Transaction | null
  ) => {
    if (prevTargetRef.current !== event.target) {
      setShowPopover(true);
    } else {
      setShowPopover(!showPopover);
    }
    prevTargetRef.current = event.target;
    setSelectedCategory(category);
    setSelectedTransaction(transaction);
    setAmount(transaction?.amount ?? 0);
    setTarget(event.target);
  };

  const handleSubmit = () => {
    // case 1: new statement + new transaction
    if (!statement.id && statement.date && selectedCategory) {
      createStatementMutation({
        variables: {
          data: {
            date: dateToString(statement.date),
            year: String(statement.date.getFullYear()),
            transactions: {
              create: [
                { amount: amount, category: { connect: selectedCategory._id } },
              ],
            },
          },
        },
      });

      if (!createStatementErr) {
        setShowPopover(false);
      }
    }

    // case 2: existing statement + new stransaction
    if (statement.id && !selectedTransaction?._id && selectedCategory) {
      createTransactionMutation({
        variables: {
          data: {
            amount: amount,
            statement: { connect: statement.id },
            category: { connect: selectedCategory._id },
          },
        },
      });

      if (!createTransactionErr) {
        setShowPopover(false);
      }
    }

    // case 3: existing statement + existing transaction
    if (statement.id && selectedTransaction?._id) {
      updateTransactionMutation({
        variables: {
          id: selectedTransaction._id,
          data: {
            amount: amount,
          },
        },
      });

      if (!updateTransactionErr) {
        setShowPopover(false);
      }
    }
  };

  const handleDelete = () => {
    if (selectedTransaction?._id) {
      deleteTransactionMutation({
        variables: {
          id: selectedTransaction._id,
        },
      });

      if (!deleteTransactionErr) {
        setShowPopover(false);
      }
    }
  };

  const handleDeleteStatement = () => {
    if (statement.id) {
      deleteStatementMutation({
        variables: {
          id: statement.id,
        },
      });

      if (!deleteStatementErr) {
        // delete any transactions associated with this statement
        data?.findStatementByID?.transactions.data.forEach((t) => {
          if (t?._id) {
            deleteTransactionMutation({
              variables: {
                id: t._id,
              },
            });
          }
        });
        setShowPopover(false);
        setSelectedStatement(null);
      }
    }
  };

  const handleClosePopover = () => {
    setShowPopover(false);
  };

  useEffect(() => {
    setShowPopover(false);
    setSelectedCategory(null);
  }, [statement]);

  if (loadingStatement || loadingCategories) {
    return <Spinner />;
  }

  if (error) {
    return <div>Oops, error happened. {JSON.stringify(error)}</div>;
  }

  const income = data?.findStatementByID?.transactions.data.filter(
    (t) => t?.category.type === CategoryType.Income
  );
  const expenses = data?.findStatementByID?.transactions.data.filter(
    (t) => t?.category.type === CategoryType.Expense
  );
  const savings = data?.findStatementByID?.transactions.data.filter(
    (t) => t?.category.type === CategoryType.Saving
  );

  const filteredCategories =
    results?.allCategories.data.filter((c) => {
      return (
        !c?.archived &&
        !data?.findStatementByID?.transactions.data.find(
          (s) => s?.category._id === c?._id
        )
      );
    }) ?? [];

  const totalIncome =
    income?.reduce((prev, cur) => {
      return prev + (cur?.amount ?? 0);
    }, 0) ?? 0;
  const totalExpense =
    expenses?.reduce((prev, cur) => {
      return prev + (cur?.amount ?? 0);
    }, 0) ?? 0;
  const totalSaving =
    savings?.reduce((prev, cur) => {
      return prev + (cur?.amount ?? 0);
    }, 0) ?? 0;

  const total = totalIncome - totalExpense - totalSaving;

  return (
    <>
      <div>
        Statement Date: {statement && dateToString(statement.date)}
        {statement.id && (
          <Button variant="danger" type="reset" onClick={handleDeleteStatement}>
            Delete
          </Button>
        )}
      </div>
      <ListGroup>
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
          variant="success"
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">
              Income: {formatter.format(totalIncome)}
            </div>
          </div>
        </ListGroup.Item>
        {income && (
          <ListGroup variant="flush">
            {income.map((i) => (
              <ListGroup.Item
                key={i?._id}
                action
                onClick={(event) =>
                  handleClick(event, i?.category ?? null, i ?? null)
                }
              >
                {i?.category.title} - {formatter.format(i?.amount ?? 0)}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
          variant="danger"
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">
              Expenses: {formatter.format(totalExpense)}
            </div>
          </div>
        </ListGroup.Item>
        {expenses && (
          <ListGroup variant="flush">
            {expenses.map((i) => (
              <ListGroup.Item
                key={i?._id}
                action
                onClick={(event) =>
                  handleClick(event, i?.category ?? null, i ?? null)
                }
              >
                {i?.category.title} - {formatter.format(i?.amount ?? 0)}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
          variant="warning"
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">
              Savings: {formatter.format(totalSaving)}
            </div>
          </div>
        </ListGroup.Item>
        {savings && (
          <ListGroup variant="flush">
            {savings.map((i) => (
              <ListGroup.Item
                key={i?._id}
                action
                onClick={(event) =>
                  handleClick(event, i?.category ?? null, i ?? null)
                }
              >
                {i?.category.title} - {formatter.format(i?.amount ?? 0)}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
          variant="info"
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">Total: {formatter.format(total)}</div>
          </div>
        </ListGroup.Item>
      </ListGroup>

      <div>
        {filteredCategories.map((c) => {
          return (
            <Button
              key={c?._id}
              size="sm"
              onClick={(event) => handleClick(event, c ?? null, null)}
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
          );
        })}
        <Overlay
          show={showPopover}
          target={target}
          placement="bottom"
          containerPadding={20}
        >
          <Popover id="popover-contained">
            <Popover.Header as="h3">{selectedCategory?.title}</Popover.Header>
            <Popover.Body>
              <InputGroup className="mb-3">
                <InputGroup.Text>$</InputGroup.Text>
                <FormControl
                  aria-label="Amount"
                  placeholder="0"
                  onChange={(e) => setAmount(Number(e.target.value))}
                  value={amount}
                  type="number"
                />
              </InputGroup>
              <Button variant="success" type="submit" onClick={handleSubmit}>
                Save
              </Button>
              <Button variant="danger" type="reset" onClick={handleDelete}>
                Delete
              </Button>
              <Button type="reset" onClick={handleClosePopover}>
                Close
              </Button>
            </Popover.Body>
          </Popover>
        </Overlay>
      </div>
    </>
  );
}
