import React, { lazy } from "react";

import { formatPercentage, formatPrice } from "../../../../util/format";

const TableCell = lazy(() => import(`@material-ui/core/TableCell/TableCell`));
const Typography = lazy(() => import(`@material-ui/core/Typography/Typography`));

const PairSpread = ({ emd, mostCompetitivePrices }) => {
	const { lowAsk, highBid } = mostCompetitivePrices;
	const { b: innerBid, a: innerAsk } = emd;

	const style = (() => {
		if (innerAsk === lowAsk && innerBid === highBid) {
			return { fontStyle: `italic`, color: `green` };
		} else if (innerAsk === lowAsk) {
			return { color: `green` };
		} else if (innerBid === highBid) {
			return { color: `red` };
		} else {
			return { };
		}
	})();

	const spreadRatioDifference = ((innerAsk / innerBid) - 1) || 0;
	const spreadString = `${formatPrice(innerBid)} - ${formatPrice(innerAsk)} (${formatPercentage(spreadRatioDifference)})`;

	return (
		<TableCell align="right">
			<Typography style={style}>
				{spreadString}
			</Typography>
		</TableCell>
	);
};

export default PairSpread;