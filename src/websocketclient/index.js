import io from "socket.io-client";
import {updateMarket} from "../actions";
import {store} from "../index";

export const subscribeToSocketBroadcasts = () => {
  const socket = io("http://localhost:7000");
  socket.on("marketBroadcast", receivedMarket => {
    updateMarket(receivedMarket)(store.dispatch);
  });
};
