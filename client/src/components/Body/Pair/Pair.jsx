import React from "react";
import { connect } from "react-redux";

import Button from "@material-ui/core/Button/Button";
import Grid from "@material-ui/core/Grid/Grid";
import Table from "@material-ui/core/Table/Table";

import * as actions from "../../../actions";
import { pages } from "../../../model/pages";

import { PairButton } from "./PairButton";
import { PairHead } from "./PairHead";
import { PairBody } from "./PairBody/PairBody";

const unconnectedPair = ({ market, activePage, setPage, viewport }) => {
	const initialVW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	const vw = viewport.width || initialVW;

	const { pair } = activePage;
	const m = market.market;
	const p = m[pair.base_symbol + "/" + pair.quote_symbol];

	const colGroup = (vw < 760) ? (
		<colgroup>
			<col style={{ width: "20%" }}/>
			<col style={{ width: "80%" }}/>
		</colgroup>
	) : (
		<colgroup>
			<col style={{ width: "15%" }}/>
			<col style={{ width: "40%" }}/>
			<col style={{ width: "20%" }}/>
			<col style={{ width: "25%" }}/>
		</colgroup>
	);

	const innerContent = p ? (
		<>
			<Grid item>
				<PairButton p={p}/>
			</Grid>
			<Grid item>
				<Table
					padding="dense"
					style={{ tableLayout: "fixed" }}>
					{colGroup}
					<PairHead p={p}/>
					<PairBody p={p} market={m} exchanges={market.exchanges}/>
				</Table>
			</Grid>
		</>
	) : (
		<Grid item>
			<Button fullWidth
		            onClick={() => {
			            setPage(pages.MARKET)
		            }}
		            style={{ fontSize: "24px" }}
			>
				Back
			</Button>
		</Grid>
	);

	return (
		<Grid
			container
			direction="column"
			spacing={8}
		>
			{innerContent}
		</Grid>
	);
};

const Pair = connect(({ market, activePage, deltaY, viewport }) => ({ market, activePage, deltaY, viewport }), actions)(unconnectedPair);

export { Pair };