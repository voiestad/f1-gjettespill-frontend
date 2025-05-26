function Table(props) {
  const { name, header, body } = props.table
  return (
    <>
      <h3>{name}</h3>
      <table>
        <thead>
          <tr>
            {header.map((cell, i) => (
              <th>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, i) => (
            <tr key={row.key}>
              {
                row.row.map((cell, j) => (
                  <td>{cell}</td>
                ))
              }
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Table
