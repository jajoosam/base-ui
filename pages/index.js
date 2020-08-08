import Logo from "../components/Logo";
import SideBar from "../components/SideBar";
import QueryBar from "../components/QueryBar";
import Grid from "../components/Grid";
import Meta from "../components/Meta";

import axios from "axios";
import { css } from "emotion";
import { useState, useEffect } from "react";
import { useImmer, useImmerReducer } from "use-immer";

import { dataDispatcher } from "../utils/dataDispatcher";
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

  // Sidebar States
  let [sidebarState, setSidebarState] = useImmer({
    collection: undefined,
    secret: undefined,
    limit: 20,
    buttonState: {
      text: "🔄 Sync",
      disabled: false,
    },
  });

  // Querybar State
  let [querybarState, setQuerybarState] = useImmer({
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
      ? setSidebarState((e) => {
          e.collection = localStorage.collection;
        })
      : console.log("waaa");
    localStorage.secret
      ? setSidebarState((e) => {
          e.secret = localStorage.secret;
        })
      : null;
    localStorage.limit
      ? setSidebarState((e) => {
          e.limit = localStorage.limit;
        })
      : null;
    localStorage.query
      ? setQuerybarState((e) => {
          e.query = localStorage.query;
        })
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
            const val = e.target.value;
            setSidebarState((d) => {
              d.secret = val;
            });
            localStorage.secret = val;
          }}
          onCollectionChange={(e) => {
            const val = e.target.value;

            setSidebarState((d) => {
              d.collection = val;
            });
            localStorage.collection = val;
          }}
          onLimitChange={(e) => {
            const val = e.target.value;
            setSidebarState((d) => {
              d.limit = parseInt(val);
            });
            localStorage.limit = parseInt(val);
          }}
          onSync={(e) => {
            setSidebarState((d) => {
              d.buttonState = { text: "🔄 Syncing...", disabled: true };
            });
            syncData().then(() => {
              fetchData().then(() =>
                setSidebarState((d) => {
                  d.buttonState = { text: "Sync", disabled: false };
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
            const val = e.target.value;

            setQuerybarState((d) => {
              d.query = val;
            });
            localStorage.query = val;
          }}
          onFetch={async (e) => {
            setQuerybarState((d) => {
              d.buttonState = { text: "Fetching...", disabled: true };
            });
            fetchData().then(() => {
              setQuerybarState((d) => {
                d.buttonState = { text: "Fetch", disabled: false };
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
