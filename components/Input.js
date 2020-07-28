import { css } from "emotion";

import Label from "./Label";

const Input = ({
  placeholder,
  label,
  type,
  tag,
  value,
  color,
  onChange,
  required,
}) => {
  return (
    <div
      className={css`
        margin: 1em;
      `}
    >
      <Label {...{ color }}>{label}</Label>
      <br />
      {!tag ? (
        <input
          className={css`
            display: block;
            border-radius: 0;
            height: 2.5em;
            font-size: 0.9em;
            padding: 10px;
            font-family: monospace;
            width: 100%;
          `}
          {...{
            placeholder,
            type,
            value,
            onChange,
            required: required === false ? false : true,
          }}
        />
      ) : (
        <textarea
          className={css`
            width: 90%;
            border-radius: 0;
            height: 200px;
          `}
          {...{ placeholder, value, onChange }}
        />
      )}
    </div>
  );
};
export default Input;
