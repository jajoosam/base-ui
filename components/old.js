import { useEffect } from "react";

const Grid = ({ data, setData }) => {
  useEffect(() => {
    console.log(data);
  }, [data]);
  console.log("render");
  const columns = Object.keys(data[0]);

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th>{column}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, i) => {
          return (
            <tr>
              {columns.map((key) => {
                let value = row[key];
                let type = "text";
                console.log(typeof value);
                if (typeof value === "number") type = "number";
                if (typeof value === "boolean") type = "radio";
                return (
                  <td>
                    <input
                      className="in-table"
                      {...{ type, value }}
                      onChange={(e) => {
                        let temp = data;
                        console.log(type);
                        temp[i][key] =
                          type === "number"
                            ? parseFloat(e.target.value)
                            : type === "radio"
                            ? e.target.checked
                            : e.target.value;
                        setData(temp);
                      }}
                    />
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Grid;
