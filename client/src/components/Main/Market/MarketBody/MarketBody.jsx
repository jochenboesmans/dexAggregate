import _ from "lodash";
import React from "react";
import { connect } from "react-redux";

import TableBody from "@material-ui/core/TableBody/TableBody";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableRow from "@material-ui/core/TableRow/TableRow";

import * as actions from "../../../../actions";
import { pages } from "../../../../model/pages";
import { formatPrice, formatVolume } from "../../../../util/formatFunctions";
import { Spread } from "./Spread";

const unconnectedMarketBody = ({ market, searchFilter, deltaY, setDeltaY, setPage, setSearchFilter }) => {
	// TODO: Replace by suspense
	if(!market.market) {
		return null;
	}
	const m = market.market;
	const orderedMarket = _.orderBy(m, [p => _.sumBy(p.market_data, emd => emd.volume_dai)], ["desc"]);
	const filteredMarket = searchFilter ? _.filter(orderedMarket,
	                                               p => p.base_symbol.includes(searchFilter.toUpperCase())
	                                               || p.quote_symbol.includes(searchFilter.toUpperCase()))
																									: orderedMarket;
	const start = 0;
	const end = 10;
	const slicedMarket = filteredMarket.slice(start + deltaY, end + deltaY);
	return (
		<TableBody onWheel={(e) => {
			if (e.deltaY < 0 && deltaY > 9 && !searchFilter) {
				setDeltaY(deltaY - 10);
			} else if (e.deltaY > 0 && (deltaY < m.length - 10) && !searchFilter) {
				setDeltaY(deltaY + 10);
			}
		}}>
			{_.map(slicedMarket, p => {
				const combinedVolume = _.sumBy(p.market_data, emd => emd.volume_dai);
				const weightedSumLastTraded = _.sumBy(p.market_data, emd => emd.volume_dai * emd.last_traded_dai);
				const volumeWeightedLastTraded =  weightedSumLastTraded / combinedVolume;

				const formattedVolumeWeightedLastTraded = formatPrice(volumeWeightedLastTraded);
				const formattedCombinedVolume = formatVolume(combinedVolume);

				return (
				 <TableRow hover
				           onClick={() => {
				             setPage({...pages.PAIR, pair: p});
				             setSearchFilter(null);
				           }}
				           key={`${p.base_symbol}/${p.quote_symbol}`}
				 >
				   <TableCell>{`${p.base_symbol}/${p.quote_symbol}`}</TableCell>
				   <Spread p={p} market={m}/>
				   <TableCell numeric>{`${formattedVolumeWeightedLastTraded}`}</TableCell>
				   <TableCell numeric>{`${formattedCombinedVolume}`}</TableCell>
				 </TableRow>
				);
				}
			)}
		</TableBody>
	)
};

const MarketBody = connect(({ market, searchFilter, deltaY }) => ({ market, searchFilter, deltaY }),
                           actions)(unconnectedMarketBody);

export { MarketBody };