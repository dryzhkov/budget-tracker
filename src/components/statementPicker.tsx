import { Spinner } from "./lib";

import Dropdown from "react-bootstrap/Dropdown";
import ListGroup from "react-bootstrap/ListGroup";
import { useState } from "react";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { dateToString, formatDate, getYear, stringToDate } from "utils/dates";
import { useGetStatementsByYearQuery, Statement } from "generated/graphql";

interface StatementPickerProps {
  selectedDate: Date | null;
  setSelectedDate: (value: Date | null) => void;
}

type StatementResult = Omit<Statement, "_ts" | "transactions">;

function isStatement(
  item: StatementResult | undefined | null
): item is StatementResult {
  return item !== undefined && item !== null;
}

export function StatementPicker({
  selectedDate,
  setSelectedDate,
}: StatementPickerProps) {
  const [year, setYear] = useState<string>(getYear());
  const [pickerDate, setPickerDate] = useState<Date | null>(null);

  const {
    data: results,
    loading,
    error,
  } = useGetStatementsByYearQuery({ variables: { year } });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Oops, error happened. {JSON.stringify(error)}</div>;
  }

  const handleYearChanged = (event: any) => {
    const { target } = event.nativeEvent;
    const value = target[target.selectedIndex].text;
    setYear(value);
    setSelectedDate(null);
  };

  return (
    <>
      <Dropdown
        className="d-inline mx-2"
        as="select"
        onChange={handleYearChanged}
        onSelect={(event) => console.log(event)}
        value={year}
      >
        <Dropdown.Item as="option" eventKey="2021">
          2021
        </Dropdown.Item>
        <Dropdown.Item as="option" eventKey="2020">
          2020
        </Dropdown.Item>
        <Dropdown.Item as="option" eventKey="2019">
          2019
        </Dropdown.Item>
        <Dropdown.Item as="option" eventKey="2018">
          2018
        </Dropdown.Item>
      </Dropdown>

      <DatePicker
        selected={pickerDate}
        onChange={(date: Date | null) => {
          setPickerDate(date);
          setSelectedDate(date);
        }}
      />

      <ListGroup>
        {pickerDate && (
          <ListGroup.Item action disabled key={"new-paydate"}>
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
                onClick={(event: any) =>
                  setSelectedDate(stringToDate(event.target.innerText))
                }
                key={item.key}
              >
                {formatDate(item.date)}
              </ListGroup.Item>
            );
          })}
      </ListGroup>
    </>
  );
}
