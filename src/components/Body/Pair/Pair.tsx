import React, { lazy, useContext, FC } from "react";

import Button from "@material-ui/core/Button/Button";
import Grid from "@material-ui/core/Grid/Grid";
import Table from "@material-ui/core/Table/Table";

import {
	ViewportStateContext,
	ActivePageStateContext,
	ActivePageDispatchContext,
	MarketStateContext,
} from "../../../state/contexts/contexts";

const PairButton = lazy(() => import(`./PairButton`));
const PairHead = lazy(() => import(`./PairHead`));
const PairBody = lazy(() => import(`./PairBody/PairBody`));

const Pair: FC = () => {
	const { width: vw } = useContext(ViewportStateContext);
	const { market: m/*, exchanges*/ } = useContext(MarketStateContext);
	const { pair: activePair }  = useContext(ActivePageStateContext);
	const activePageDispatch = useContext(ActivePageDispatchContext);

	const p = m.find(mPair =>
		mPair.baseSymbol === activePair.baseSymbol && mPair.quoteSymbol === activePair.quoteSymbol);

	const colWidths = (vw < 760) ? [`20%`, `80%`] : [`15%`, `40%`, `20%`, `25%`];
	const colGroup = (
		<colgroup>
			{colWidths.map((cw, i) => <col key={i} style={{ width: cw }}/>)}
		</colgroup>
	);

	const innerContent = p ? (
		<>
			<Grid item>
				<PairButton p={p}/>
			</Grid>
			<Grid item>
				<Table padding="checkbox" style={{ tableLayout: `fixed` }}>
					{colGroup}
					<PairHead p={p}/>
					<PairBody p={p}/>
				</Table>
			</Grid>
		</>
	) : (
		<Grid item>
			<Button
				fullWidth
		    onClick={() => activePageDispatch({ type: `RESET` })}
		    style={{ fontSize: `24px` }}
			>
				Back
			</Button>
		</Grid>
	);

	return (
		<Grid container direction="column" spacing={0}>
			{innerContent}
		</Grid>
	);
};

export default Pair;