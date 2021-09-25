import React from "react";

const Table = (props) => {
	return (
		<div className="table">
			{props.countries.map((country) => {
				return (
					<tr>
						<td>{country.country}</td>
						<td>{country.cases}</td>
					</tr>
				);
			})}
		</div>
	);
};

export default Table;
