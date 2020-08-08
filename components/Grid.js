import { useMemo, useState, useEffect } from "react";
import Modal from "./Editor"
import JSON5 from "json5"
const Grid = ({ data, dispatch, changes, onAppend }) => {
  const columns = useMemo(
    () =>
      [...new Set(data.map((e) => Object.keys(e)).flat())].map((key) => {
        let type = undefined;
        for (let i = 0; i < data.length; i++) {
          if (data[i][key]) {
            type = typeof data[i][key];
            if(type==="object" && Array.isArray(data[i][key])) type = "array" 
            break;
          }
        }
        return { type, name: key };
      }),
    [data]
  );

  const [toEdit, setToEdit] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);

  const startEdit = (i, key) => {
    setToEdit({index: i, key});
  };

  const onEdit = (code) => {
    dispatch({
      type: "set",
      index: toEdit.index,
      key: toEdit.key,
      new: JSON5.parse(code)
    });
  }

  useEffect(()=>{
    toEdit && setIsOpen(true)
  }, [toEdit]);


  if (data.length === 0) {
    return (
      <blockquote>
        Hit the <strong>Fetch</strong> button!
      </blockquote>
    );
  }

  return (
    <main>
    {
     toEdit &&
      <Modal {...{isOpen, setIsOpen, content: JSON5.stringify(data[toEdit.index][toEdit.key], null, 2), onEdit}}/>
    }
      
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
                  if (Array.isArray(value)) type = "array";
                  return (
                    <td className={`type-${type}`}>
                    {console.log(type)}
                      {type === "object" || type === "array" ? (
                        <button onClick={() => startEdit(i, key.name)}>
                          {type}
                        </button>
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
