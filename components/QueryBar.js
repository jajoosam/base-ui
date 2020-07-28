import { css } from "emotion";

const QueryBar = ({ onChange, onFetch, value, buttonState }) => (
  <div style={{ display: "flex", width: "100%" }}>
    <div
      style={{
        width: "100%",
        margin: "auto",
        border: "2px solid black",
        display: "inline-block",
      }}
    >
      <input
        value={value}
        onChange={onChange}
        style={{ marginBottom: 0, fontFamily: "monospace", width: "100%" }}
        placeholder="Enter a query here, or leave it empty"
      />
    </div>
    &nbsp;&nbsp;
    <button
      onClick={onFetch}
      disabled={buttonState.disabled}
      className={css`
        height: 100%;
        margin: auto;
      `}
    >
      {buttonState.text}
    </button>
  </div>
);

export default QueryBar;
