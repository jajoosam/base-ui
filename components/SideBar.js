import { css } from "emotion";

import Input from "./Input";

const SideBar = ({
  secret,
  collection,
  onSecretChange,
  onCollectionChange,
  changes,
  onSync,
  syncButtonState,
}) => {
  return (
    <div
      style={{
        border: "2px solid black",
      }}
    >
      <div>
        <Input
          onChange={onSecretChange}
          value={secret}
          label="🔑 project secret"
          placeholder="x34852dh23dj-32ufdn-dnw..."
        />
        <Input
          onChange={onCollectionChange}
          value={collection}
          label="📁 collection"
          placeholder="applications-1"
        />
        <br />
        <strong
          className={css`
            margin: 1em;
            margin-bottom: 0;
            display: block;
          `}
        >
          {changes.length} row{changes.length === 1 ? "" : "s"} to sync.
        </strong>
        <button
          onClick={onSync}
          className={css`
            margin: 1em;
          `}
          disabled={changes.length === 0 || syncButtonState.disabled}
        >
          {syncButtonState.text}
        </button>
      </div>
    </div>
  );
};

export default SideBar;
