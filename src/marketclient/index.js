import * as withAbsintheSocket from "@absinthe/socket";
import { Socket as PhoenixSocket } from "phoenix";
import axios from "axios";

const absintheSocket = withAbsintheSocket.create(
	new PhoenixSocket(`ws://dexaggregate.com/socket`)
);

const httpURL = `http://dexaggregate.com/graphql`;

const queryHTTPEndpoint = async (query) => await axios.request({
	url: httpURL,
	method: `POST`,
	headers: { 'Content-Type': `application/json`},
	data: JSON.stringify({ query: query })
});

/* operation should be "subscription" | "query" */
const daiRebasedMarket = (operation) => `
	${operation} daiRebasedMarket {
		rebasedMarket (rebaseAddress: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359") {
			baseAddress
			pairs {
				baseSymbol,
				quoteSymbol,
				marketData {
					exchange,
					lastPrice,
					currentAsk,
					currentBid,
					baseVolume
				}
			}
		}
	}
`;

/* operation should be "subscription" | "query" */
const exchanges = (operation) => `
	${operation} exchanges {
		exchanges
	}
`;

/* operation should be "subscription" | "query" */
const lastUpdate = (operation) => `
	${operation} lastUpdate {
		lastUpdate {
			utcTime
			timestamp
			pair {
				baseSymbol,
				quoteSymbol,
				marketData {
					baseVolume,
					currentAsk,
					currentBid,
					exchange,
					lastPrice,
					timestamp
				}
			}
		}
	}
`;

const subscribeToMarket = async (dispatch) => {
	const initialMarket = await queryHTTPEndpoint(daiRebasedMarket(`query`));
	dispatch({type: `SET_MARKET`, payload: initialMarket.data.data.rebasedMarket.pairs});
	const marketNotifier = withAbsintheSocket.send(absintheSocket, {
		operation: daiRebasedMarket(`subscription`)
	});
	withAbsintheSocket.observe(absintheSocket, marketNotifier, {
		onResult: data => dispatch({type: `SET_MARKET`, payload: data.data.rebasedMarket.pairs})
	});

	const initialExchanges = await queryHTTPEndpoint(exchanges(`query`));
	dispatch({type: `SET_EXCHANGES`, payload: initialExchanges.data.data.exchanges});
	const exchangesNotifier = withAbsintheSocket.send(absintheSocket, {
		operation: exchanges(`subscription`)
	});
	withAbsintheSocket.observe(absintheSocket, exchangesNotifier, {
		onResult: data => dispatch({type: `SET_EXCHANGES`, payload: data.data.exchanges})
	});

	const initialLastUpdate = await queryHTTPEndpoint(lastUpdate(`query`));
	const adaptedInitialLastUpdate = {
		pair: initialLastUpdate.data.data.lastUpdate.pair,
		timestamp: Date.now()
	};
	dispatch({type: `SET_LAST_UPDATE`, payload: adaptedInitialLastUpdate});
	const lastUpdateNotifier = withAbsintheSocket.send(absintheSocket, {
		operation: lastUpdate(`subscription`)
	});
	withAbsintheSocket.observe(absintheSocket, lastUpdateNotifier, {
		onResult: data => {
			const adaptedInitialLastUpdate = {
				pair: data.data.lastUpdate.pair,
				timestamp: Date.now()
			};
			dispatch({type: `SET_LAST_UPDATE`, payload: adaptedInitialLastUpdate});
		}
	});
};

const unsubscribeFromMarket = (dispatch) => {
	// TODO: Add teardown.
};

export { subscribeToMarket, unsubscribeFromMarket };