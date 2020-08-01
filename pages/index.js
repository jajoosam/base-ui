import Logo from "../components/Logo";
import SideBar from "../components/SideBar";
import QueryBar from "../components/QueryBar";
import Grid from "../components/Grid";
import Meta from "../components/Meta";

import axios from "axios";
import { css } from "emotion";
import { useState, useEffect } from "react";
import { useImmerReducer } from "use-immer";

import { dataDispatcher } from "../state/data";
import { isMobile } from "react-device-detect";

const Page = () => {
  // Disable on Mobile
  if (isMobile)
    return (
      <blockquote>We don't currently support Base UI on mobile!</blockquote>
    );

  // Data Reducer
  let [data, dispatch] = useImmerReducer(dataDispatcher, {
    immut: [],
    mut: [],
    changes: [],
  });

  // Sidebar State
  let [sidebarState, setSidebarState] = useState({
    collection: undefined,
    secret: undefined,
    limit: 20,
    buttonState: {
      text: "🔄 Sync",
      disabled: false,
    },
  });

  // Querybar State
  let [querybarState, setQuerybarState] = useState({
    query: undefined,
    buttonState: {
      text: "Fetch",
      disabled: false,
    },
  });

  // Page State
  let [pageState, setPageState] = useState({ page: 0, next: false });

  const fetchData = async () => {
    if (!sidebarState.secret || !sidebarState.collection)
      return alert(`Enter secret and collection name.`);
    const body = await axios.post(`/api/get`, {
      ...sidebarState,
      query: querybarState.query,
    });
    dispatch({ type: "fetch", data: body.data.value });
    return body;
  };

  const syncData = async () => {
    let newRows = data.changes.map((change) => data.mut[change]);
    let oldRows = data.changes.map((change) => data.immut[change]);
    return axios.post(`/api/set`, { newRows, oldRows, ...sidebarState });
  };

  useEffect(() => {
    localStorage.collection
      ? setSidebarState({
          ...sidebarState,
          collection: localStorage.collection,
        })
      : console.log("waaa");
    localStorage.secret
      ? setSidebarState({
          ...sidebarState,
          secret: localStorage.secret,
        })
      : null;
    localStorage.limit
      ? setSidebarState({
          ...sidebarState,
          limit: localStorage.limit,
        })
      : null;
    localStorage.query
      ? setQuerybarState({ ...querybarState, query: localStorage.query })
      : null;
  }, []);

  return (
    <div
      className={css`
        display: flex;
      `}
    >
      <Meta />
      <div
        className={css`
          width: 250px;
        `}
      >
        <Logo />
        <SideBar
          {...{
            ...sidebarState,
            changes: data.changes,
          }}
          onSecretChange={(e) => {
            setSidebarState({ ...sidebarState, secret: e.target.value });
            localStorage.secret = e.target.value;
          }}
          onCollectionChange={(e) => {
            setSidebarState({ ...sidebarState, collection: e.target.value });
            localStorage.collection = e.target.value;
          }}
          onLimitChange={(e) => {
            setSidebarState({
              ...sidebarState,
              limit: parseInt(e.target.value),
            });
            localStorage.limit = e.target.value;
          }}
          onSync={(e) => {
            setSidebarState({
              ...sidebarState,
              buttonState: { text: "🔄 Syncing...", disabled: true },
            });

            syncData().then(() => {
              fetchData().then(() =>
                setSidebarState({
                  ...sidebarState,
                  buttonState: { text: "🔄 Syncing...", disabled: true },
                })
              );
            });
          }}
        />
      </div>
      <div
        className={css`
          margin-left: 2.5em;
          width: 75%;
        `}
      >
        <QueryBar
          {...{
            value: querybarState.query,
            buttonState: querybarState.buttonState,
          }}
          onChange={(e) => {
            setQuerybarState({ ...querybarState, query: e.target.value });
            localStorage.query = e.target.value;
          }}
          onFetch={async (e) => {
            setQuerybarState({
              ...querybarState,
              buttonState: { text: "Fetching", disabled: true },
            });
            fetchData().then(() => {
              setQuerybarState({
                ...querybarState,
                buttonState: { text: "Fetch", disabled: false },
              });
            });
          }}
        />
        <br />
        <Grid {...{ data: data.mut, changes: data.changes, dispatch }} />
      </div>
    </div>
  );
};

export default Page;
