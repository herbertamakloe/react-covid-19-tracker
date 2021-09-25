import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";

const InfoBox = (props) => {
	return (
		<div>
			<Card>
				<CardContent>
					{/* Title */}
					<Typography className="infoBox__title" color="textSecondary">
						{props.title}
					</Typography>
					{/* Number Of Cases */}
					<h2 className="infoBox__cases">{props.cases}</h2>

					{/* Total */}
					<Typography className="infoBox__total" color="textSecondary">
						{props.total}
					</Typography>
				</CardContent>
			</Card>
		</div>
	);
};

export default InfoBox;
