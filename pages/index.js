import Logo from "../components/Logo";
import SideBar from "../components/SideBar";
import QueryBar from "../components/QueryBar";
import Grid from "../components/Grid";
import Meta from "../components/Meta";

import axios from "axios";
import { css } from "emotion";
import { useState, useEffect } from "react";
import { useImmerReducer } from "use-immer";
import uniqid from "uniqid";

import { isMobile } from "react-device-detect";

// TODO
// - Boolean support
// - Disable on mobile
// - Object support

const Page = () => {
  if (isMobile)
    return (
      <blockquote>We don't currently support Base UI on mobile!</blockquote>
    );
  let [query, setQuery] = useState(undefined);
  let [data, dispatch] = useImmerReducer(
    (payload, action) => {
      if (action.type === "set") {
        payload.mut[action.index][action.key] = action.new;
        if (
          payload.immut[action.index] &&
          action.new === payload.immut[action.index][action.key]
        ) {
          payload.changes = payload.changes.filter(
            (index) => index != action.index
          );
        } else {
          payload.changes.push(action.index);
        }
        payload.changes = [...new Set(payload.changes)];
        return payload;
      }

      if (action.type === "fetch") {
        payload.immut = action.data;
        payload.mut = action.data;
        payload.changes = [];
        return payload;
      }

      if (action.type === "append") {
        let object = {};
        action.columns.forEach((col) => {
          if (col.type === "number") {
            object[col.name] = 0;
          }
          if (col.type === "string") {
            object[col.name] = "abc";
          }
          if (col.type === "boolean") {
            object[col.name] = true;
          }
          if (col.type === "object") {
            object[col.name] = {};
          }
        });
        object.key = uniqid();
        payload.mut.push(object);
        payload.changes.push(payload.mut.length - 1);
        return payload;
      }
    },
    { immut: [], mut: [], changes: [] }
  );

  let [collection, setCollection] = useState(undefined);
  let [secret, setSecret] = useState(undefined);
  let [buttonState, setButtonState] = useState({
    text: "Fetch",
    disabled: false,
  });
  let [syncButtonState, setSyncButtonState] = useState({
    text: "🔄 Sync",
    disabled: false,
  });

  const fetchData = async () => {
    if (!secret || !collection)
      return alert(`Enter secret and collection name.`);
    const body = await axios.post(`/api/get`, {
      query,
      secret,
      collection,
    });
    dispatch({ type: "fetch", data: body.data.value });
    return body;
  };

  const syncData = async () => {
    let newRows = data.changes.map((change) => data.mut[change]);
    let oldRows = data.changes.map((change) => data.immut[change]);
    return axios.post(`/api/set`, { newRows, oldRows, collection, secret });
  };

  useEffect(() => {
    localStorage.collection ? setCollection(localStorage.collection) : null;
    localStorage.secret ? setSecret(localStorage.secret) : null;
    localStorage.query ? setQuery(localStorage.query) : null;
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
            secret,
            collection,
          }}
          onSecretChange={(e) => {
            setSecret(e.target.value);
            localStorage.secret = e.target.value;
          }}
          onCollectionChange={(e) => {
            setCollection(e.target.value);
            localStorage.collection = e.target.value;
          }}
          changes={data.changes}
          syncButtonState={syncButtonState}
          onSync={(e) => {
            setSyncButtonState({ text: "🔄 Syncing...", disabled: true });
            syncData().then(() => {
              fetchData().then(() =>
                setSyncButtonState({ text: "🔄 Sync", disabled: false })
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
          onChange={(e) => {
            setQuery(e.target.value);
            localStorage.query = e.target.value;
          }}
          value={query}
          buttonState={buttonState}
          onFetch={async (e) => {
            setButtonState({ text: "Fetching", disabled: true });
            fetchData().then(() => {
              setButtonState({ text: "Fetch", disabled: false });
            });
          }}
        />
        <br />
        <Grid data={data.mut} dispatch={dispatch} changes={data.changes} />
      </div>
    </div>
  );
};

export default Page;
