import React from "react";

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import Paper from "material-ui/Paper";

export default function SummaryGrid(props) {
  const renderTableHeaders = headers => {
    if (headers && headers.length) {
      const colHeaders = [];
      headers.forEach((el, i) => {
        colHeaders.push(
          <TableHeaderColumn key={i} tooltip={el}>
            {el}
          </TableHeaderColumn>
        );
      });

      return <TableRow>{colHeaders}</TableRow>;
    }
  };

  const renderTableRows = rows => {
    if (rows && rows.length) {
      return rows.map((cols, index) => {
        let arr = [];
        cols.forEach((c, i) => {
          arr.push(<TableRowColumn key={i}>{c}</TableRowColumn>);
        });

        return <TableRow key={index}>{arr}</TableRow>;
      });
    }
  };

  return (
    <Paper zDepth={3} rounded={true}>
      <Table
        fixedHeader={true}
        selectable={true}
        multiSelectable={false}
        style={{
          fontFamily: "Comic Sans MS",
          height: "auto",
          maxHeight: "700px"
        }}
      >
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          {renderTableHeaders(props.headers)}
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
          showRowHover={false}
          stripedRows={true}
        >
          {renderTableRows(props.rows)}
        </TableBody>
        ;
      </Table>
    </Paper>
  );
}
