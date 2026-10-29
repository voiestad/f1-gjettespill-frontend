import type { ReactNode } from "react";

function Table({
  title,
  header,
  body,
}: {
  title: string;
  header: string[];
  body: { key: string; values: ReactNode[] }[];
}): ReactNode {
  return (
    <>
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            {header.map((cell, i) => (
              <th key={i}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row) => (
            <tr key={row.key}>
              {row.values.map((cell, i) => (
                <td key={i}>{cell != null ? cell : "N/A"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Table;
