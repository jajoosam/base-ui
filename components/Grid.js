import { useMemo } from "react";

const Grid = ({ data, dispatch, changes, onAppend }) => {
  const columns = useMemo(
    () =>
      [...new Set(data.map((e) => Object.keys(e)).flat())].map((key) => {
        let type = undefined;
        for (let i = 0; i < data.length; i++) {
          if (data[i][key]) {
            type = typeof data[i][key];
            break;
          }
        }
        return { type, name: key };
      }),
    [data]
  );

  if (data.length === 0) {
    return (
      <blockquote>
        Hit the <strong>Fetch</strong> button!
      </blockquote>
    );
  }

  return (
    <main>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th>
                {column.name}&nbsp;<sub className="type">{column.type}</sub>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => {
            return (
              <tr className={changes.includes(i) ? "changed" : ""}>
                {columns.map((key) => {
                  let value = row[key.name];
                  let type = "text";
                  if (typeof value === "number") type = "number";
                  if (typeof value === "boolean") type = "checkbox";
                  if (typeof value === "object") type = "object";
                  return (
                    <td className={`type-${type}`}>
                      {type === "object" ? (
                        "Unsupported!"
                      ) : (
                        <input
                          className="in-table"
                          {...{ type, value }}
                          onChange={(e) => {
                            dispatch({
                              type: "set",
                              index: i,
                              key: key.name,
                              new:
                                type === "number"
                                  ? parseFloat(e.target.value)
                                  : type === "checkbox"
                                  ? e.target.checked
                                  : e.target.value,
                            });
                          }}
                          checked={value}
                        />
                      )}
                      {type === "checkbox" && (
                        <span>
                          &nbsp;&nbsp;&nbsp;{value ? "True" : "False"}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        onClick={() => {
          dispatch({ type: "append", columns });
        }}
      >
        <strong>+</strong>
      </button>
    </main>
  );
};

export default Grid;
