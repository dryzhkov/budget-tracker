/** @jsxImportSource @emotion/react */
import { CategoryType, useAllStatementsQuery } from 'generated/graphql';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, Rectangle } from 'recharts';
import { Spinner } from './lib';
import { css } from '@emotion/react';

const chartSessionStyles = css`
	margin: 20px;
`;

export function Charts() {
	const { data: statementResults, loading } = useAllStatementsQuery();

	if (!statementResults || loading) {
		return <Spinner />;
	}

	const sortedStatements = statementResults?.allStatementsSortedByYearDesc.data.length
		? statementResults.allStatementsSortedByYearDesc.data.slice().sort((first, second) => {
				if (first && second) {
					return new Date(first.date).getTime() - new Date(second.date).getTime();
				}

				return 0;
		  })
		: [];

	const incomeExpenseData = sortedStatements
		.filter(s => s?.year === '2023')
		.map(statement => {
			const [month, day] = (statement?.date ?? '').split('/');
			return {
				date: month + '/' + day,
				income: Math.round(
					statement?.transactions.data
						.filter(t => t?.category.type === CategoryType.Income)
						.reduce((prev, cur) => prev + (cur?.amount ?? 0), 0) ?? 0
				),
				expense: Math.round(
					statement?.transactions.data
						.filter(t => t?.category.type === CategoryType.Expense)
						.reduce((prev, cur) => prev + (cur?.amount ?? 0), 0) ?? 0
				),
				savings: Math.round(
					statement?.transactions.data
						.filter(t => t?.category.type === CategoryType.Saving)
						.reduce((prev, cur) => prev + (cur?.amount ?? 0), 0) ?? 0
				)
			};
		});

	const renderBarChart = () => (
		<BarChart
			width={1200}
			height={600}
			data={incomeExpenseData}
			margin={{
				top: 5,
				right: 30,
				left: 20,
				bottom: 5
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
					backgroundColor: '#eee',
					border: '1px solid #d5d5d5',
					borderRadius: 3,
					lineHeight: '40px'
				}}
			/>
			<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
			<Bar dataKey="income" fill="#82ca9d" activeBar={<Rectangle fill="#0f5132" stroke="#0f5132" />} />
			<Bar dataKey="expense" fill="#ff808b" stackId="a" activeBar={<Rectangle fill="#red" stroke="#000" />} />
		</BarChart>
	);

	return (
		<>
			<section css={chartSessionStyles}>
				<h4 className="fw-bold">Income vs Expense</h4>
				{renderBarChart()}
			</section>
		</>
	);
}
