import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ApolloProvider } from "@apollo/client/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.tsx";
import { persistor, store } from "./redux/store";
import apolloClient from "./lib/apollo";
import { RealtimeProvider } from "./realtime/RealtimeProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ApolloProvider client={apolloClient}>
          <RealtimeProvider>
            <ToastContainer theme="colored" autoClose={500} />
            <App />
          </RealtimeProvider>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
