/** @jsxImportSource @emotion/react */
import { CategoryType, useAllStatementsQuery } from "generated/graphql";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Rectangle,
  ScatterChart,
  Scatter,
} from "recharts";
import { Spinner } from "./lib";
import { css } from "@emotion/react";
import { useState } from "react";
import { getYear } from "utils/dates";
import Card from "react-bootstrap/esm/Card";
import { YearPicker } from "./yearPicker";

const chartSessionStyles = css`
  margin: 20px;
`;

export function Charts() {
  const [year, setYear] = useState<number>(getYear());
  const { data: statementResults, loading } = useAllStatementsQuery();

  if (!statementResults || loading) {
    return <Spinner />;
  }

  const handleYearChanged = (year: number) => {
    setYear(year);
  };

  const sortedStatements = statementResults?.allStatementsSortedByYearDesc.data
    .length
    ? statementResults.allStatementsSortedByYearDesc.data
        .slice()
        .sort((first, second) => {
          if (first && second) {
            return (
              new Date(first.date).getTime() - new Date(second.date).getTime()
            );
          }

          return 0;
        })
    : [];

  const filteredByYear = sortedStatements.filter(
    (s) => s?.year === year.toString()
  );

  const renderTotalsChart = () => {
    const incomeExpenseTotals = filteredByYear.map((statement) => {
      const [month, day] = (statement?.date ?? "").split("/");
      return {
        date: month + "/" + day,
        income: Math.round(
          statement?.transactions.data
            .filter((t) => t?.category.type === CategoryType.Income)
            .reduce((prev, cur) => prev + (cur?.amount ?? 0), 0) ?? 0
        ),
        expense: Math.round(
          statement?.transactions.data
            .filter((t) => t?.category.type === CategoryType.Expense)
            .reduce((prev, cur) => prev + (cur?.amount ?? 0), 0) ?? 0
        ),
        savings: Math.round(
          statement?.transactions.data
            .filter((t) => t?.category.type === CategoryType.Saving)
            .reduce((prev, cur) => prev + (cur?.amount ?? 0), 0) ?? 0
        ),
      };
    });

    return (
      <BarChart
        width={1200}
        height={600}
        data={incomeExpenseTotals}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend
          width={100}
          wrapperStyle={{
            top: 40,
            right: 20,
            backgroundColor: "#eee",
            border: "1px solid #d5d5d5",
            borderRadius: 3,
            lineHeight: "40px",
          }}
        />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Bar
          dataKey="income"
          fill="#82ca9d"
          activeBar={<Rectangle fill="#0f5132" stroke="#0f5132" />}
        />
        <Bar
          dataKey="expense"
          fill="#ff808b"
          stackId="a"
          activeBar={<Rectangle fill="#red" stroke="#000" />}
        />
      </BarChart>
    );
  };

  const renderExpensesChart = () => {
    const randomHex = () =>
      "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
    const expensesOnly: any[] = [];
    const expenseTitles = new Set<string>();
    filteredByYear.forEach((statement) => {
      let expenses = {};
      statement?.transactions.data
        .filter((t) => t?.category.type === CategoryType.Expense)
        .forEach((i) => {
          expenses = {
            ...expenses,
            [`${i?.category.title}`]: i?.amount,
          };
          expenseTitles.add(i?.category.title ?? "");
        });
      expensesOnly.push({
        date: statement?.date,
        ...expenses,
      });
    });

    return (
      <ScatterChart
        width={1200}
        height={600}
        data={expensesOnly}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <CartesianGrid />
        <Legend />
        {Array.from(expenseTitles).map((title) => {
          return (
            <Scatter key={title} dataKey={title} fill={randomHex()} line />
          );
        })}
      </ScatterChart>
    );
  };

  return (
    <>
      <Card>
        <Card.Header>
          <YearPicker onYearChange={handleYearChanged} year={year} />
        </Card.Header>
      </Card>

      <Card>
        <section css={chartSessionStyles}>
          {" "}
          <h4 className="fw-bold">Income vs Expense Totals</h4>
          {renderTotalsChart()}
        </section>
      </Card>

      <Card>
        <Card.Header>
          <h4 className="fw-bold">Expenses</h4>
        </Card.Header>
        {renderExpensesChart()}
      </Card>
    </>
  );
}
