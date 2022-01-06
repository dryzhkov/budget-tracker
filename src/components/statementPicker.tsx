/** @jsxImportSource @emotion/react */
import { GraphQlError, Spinner } from "./lib";

import Dropdown from "react-bootstrap/Dropdown";
import ListGroup from "react-bootstrap/ListGroup";
import { forwardRef, useEffect, useState } from "react";

import Card from "react-bootstrap/Card";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { dateToString, formatDate, getYear, stringToDate } from "utils/dates";
import { useGetStatementsByYearQuery, Statement } from "generated/graphql";
import type { ButtonProps } from "react-bootstrap/Button";
import Button from "react-bootstrap/Button";
import { css } from "@emotion/react";

const getYears = () => {
  const startingYear = 2018;
  const years = [startingYear];
  for (let i = startingYear + 1; i <= getYear(); i++) {
    years.unshift(i);
  }
  return years;
};

interface StatementPickerProps {
  statement: StatementDto | null;
  setSelectedStatement: (value: StatementDto | null) => void;
}

type StatementResult = Omit<Statement, "__typename" | "_ts" | "transactions">;

export type StatementDto = {
  date: Date;
  id?: Statement["_id"];
};

function isStatement(
  item: StatementResult | undefined | null
): item is StatementResult {
  return item !== undefined && item !== null;
}

const yearPicker = css`
  position: absolute;
  top: 10px;
  right: 5px;
`;

const addStatementButton = css`
  width: 100%;
  margin-bottom: 10px;
`;

const listGroup = css`
  max-height: calc(100vh - 200px);
  margin-bottom: 10px;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
`;

const AddNewStatementButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick }, ref) => (
    <Button
      css={addStatementButton}
      onClick={onClick}
      ref={ref}
      variant="outline-primary"
      size="sm"
    >
      +
    </Button>
  )
);

export function StatementPicker({
  statement,
  setSelectedStatement,
}: StatementPickerProps) {
  const [year, setYear] = useState<number>(getYear());
  const [pickerDate, setPickerDate] = useState<Date | null>(null);

  const {
    data: results,
    loading,
    error,
  } = useGetStatementsByYearQuery({ variables: { year: year.toString() } });

  useEffect(() => {
    setPickerDate(null);
  }, [results?.statementsByYear.data]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <GraphQlError error={error} />;
  }

  const handleYearChanged = (event: any) => {
    const { target } = event.nativeEvent;
    const value = target[target.selectedIndex].text;
    setYear(value);
    setSelectedStatement(null);
    setPickerDate(null);
  };

  return (
    <>
      <DatePicker
        selected={pickerDate}
        withPortal
        placeholderText="Click to add a statement"
        customInput={<AddNewStatementButton />}
        filterDate={(date) => {
          const day = date.getDay();
          return day !== 0 && day !== 6;
        }}
        onChange={(date: Date | null) => {
          setPickerDate(date);
          setSelectedStatement(date ? { date } : null);
        }}
      />
      <Card>
        <Card.Header>
          Statements{" "}
          <Dropdown
            className="d-inline mx-2"
            as="select"
            onChange={handleYearChanged}
            value={year}
            css={yearPicker}
          >
            {getYears().map((year) => (
              <Dropdown.Item as="option" eventKey={year} key={year}>
                {year}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </Card.Header>

        <ListGroup css={listGroup}>
          {pickerDate && (
            <ListGroup.Item action active key={"new-paydate"}>
              {dateToString(pickerDate)}
            </ListGroup.Item>
          )}
          {results?.statementsByYear.data
            .filter(isStatement)
            .map((item) => {
              return { key: item._id, date: item.date };
            })
            .sort(
              (first, second) =>
                new Date(second.date).getTime() - new Date(first.date).getTime()
            )
            .map((item) => {
              return (
                <ListGroup.Item
                  action
                  active={
                    !!statement &&
                    formatDate(dateToString(statement.date)) ===
                      formatDate(item.date)
                  }
                  onClick={() => {
                    setSelectedStatement({
                      id: item.key,
                      date: stringToDate(item.date),
                    });
                    setPickerDate(null);
                  }}
                  key={item.key}
                >
                  {formatDate(item.date, { month: "long" })}
                </ListGroup.Item>
              );
            })}
        </ListGroup>
      </Card>
    </>
  );
}
