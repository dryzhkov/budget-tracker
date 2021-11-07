import {
  Category,
  CategoryType,
  Transaction,
  useAllCategoriesQuery,
  useGetStatementByIdQuery,
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
import { useRef, useState } from "react";
interface StatementEditorProps {
  statement: StatementDto | null;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function StatementEditor({ statement }: StatementEditorProps) {
  const {
    data,
    loading: loadingStatement,
    error,
  } = useGetStatementByIdQuery({
    variables: { id: statement?.id ?? "" },
    skip: !statement?.id,
  });

  const { data: results, loading: loadingCategories } = useAllCategoriesQuery();
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const ref = useRef(null);
  const prevTargetRef = useRef(null);

  const handleClick = (
    event: any,
    category: Category | null,
    transaction: Transaction | null
  ) => {
    if (prevTargetRef.current !== event.target) {
      setShow(true);
    } else {
      setShow(!show);
    }
    prevTargetRef.current = event.target;
    setSelectedCategory(category);
    setSelectedTransaction(transaction);
    setTarget(event.target);
  };

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
    <div ref={ref}>
      <div>Statement Date: {statement && dateToString(statement.date)}</div>
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
          show={show && !!ref.current}
          target={target}
          placement="bottom"
          container={ref}
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
                  defaultValue={selectedTransaction?.amount}
                  type="number"
                />
              </InputGroup>
              <Button variant="success" type="submit">
                Save
              </Button>
              <Button variant="danger" type="reset">
                Cancel
              </Button>
            </Popover.Body>
          </Popover>
        </Overlay>
      </div>
    </div>
  );
}
