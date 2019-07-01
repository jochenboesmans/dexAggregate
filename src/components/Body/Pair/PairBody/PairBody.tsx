import React, { lazy, useContext, FC } from "react";

import orderBy from "lodash/orderBy";

import TableBody from "@material-ui/core/TableBody/TableBody";
import TableRow from "@material-ui/core/TableRow/TableRow";

import { ViewportStateContext, MarketStateContext } from "../../../../state/contexts/contexts";
import { ExchangeMarketData, Pair } from "../../../../types/market";
import { innerAsk, innerBid } from "../../../../util/aggregate";

const MobilePairBody = lazy(() => import(`./Mobile/MobilePairBody`));
const RegularPairBody = lazy(() => import(`./Regular/RegularPairBody`));

interface PropsType { p: Pair }

const PairBody: FC<PropsType> = ({ p }) => {
	const { width: vw } = useContext(ViewportStateContext);
	const { exchanges } = useContext(MarketStateContext);

	const sortedMarketData: Array<ExchangeMarketData> = p ? orderBy(p.marketData, [emd => emd.baseVolume], "desc") : null;

	const handleClick = (exchange, p) => {
		const exchangeURL = {
			"kyber": (p) => `https://kyberswap.com/swap/${p.baseSymbol}_${p.quoteSymbol}`,
			"oasis": (p) => `https://eth2dai.com/`,
			"paradex": (p) => `https://paradex.io/market/${p.quoteSymbol}-${p.baseSymbol}`,
			"ddex": (p) => `https://ddex.io/trade/${p.baseSymbol}-${p.quoteSymbol}`,
			"idex": (p) => `https://idex.market/${p.baseSymbol}/${p.quoteSymbol}`,
			"radar": (p) => `https://app.radarrelay.com/${p.quoteSymbol}/${p.baseSymbol}`,
			"uniswap": (p) => `https://uniswap.exchange/swap`,
			"tokenstore": (p) => `https://token.store/trade/${p.quoteSymbol}`,
		};

		const URL = exchangeURL[exchange](p);
		window.open(URL, `_blank`);
	};

	return (
		<TableBody>
			{sortedMarketData.map(emd => {
				const mostCompetitivePrices = { lowAsk: innerAsk(p), highBid : innerBid(p)};

				const innerContent = (vw < 760) ? <MobilePairBody emd={emd} mostCompetitivePrices={mostCompetitivePrices}/> :
					<RegularPairBody emd={emd} exchanges={exchanges} mostCompetitivePrices={mostCompetitivePrices}/>;

				return (
					<TableRow
						hover
						onClick={() => handleClick(emd.exchange, p)}
						key={emd.exchange}
						style={{ height: "4vh" }}
					>
						{innerContent}
					</TableRow>
				);
			})}
		</TableBody>
	);
};

export default PairBody;