/** @jsxImportSource @emotion/react */
import { SerializedStyles } from '@emotion/react';
import Dropdown from 'react-bootstrap/Dropdown';
import { getYears } from 'utils/dates';

type YearPickerProps = {
	onYearChange: (year: number) => void;
	year: number;
	styles?: SerializedStyles;
};

export function YearPicker({ onYearChange, year, styles }: YearPickerProps) {
	const handleYearChanged = (event: any) => {
		const { target } = event.nativeEvent;
		const value = target[target.selectedIndex].text as number;
		onYearChange(value);
	};

	return (
		<Dropdown className="d-inline mx-2" as="select" onChange={handleYearChanged} value={year} css={styles}>
			{getYears().map(year => (
				<Dropdown.Item as="option" eventKey={year} key={year}>
					{year}
				</Dropdown.Item>
			))}
		</Dropdown>
	);
}
