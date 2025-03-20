import Container from '../../shared/Container/Container';
import type { TestComponentProps } from './TestComponent.emb';


const getRandomString = (length: number = 5) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
};

const RandomTable = () => {
  const columns = Array.from({ length: 10 }, (_, index) => `Column ${index + 1}`);

  // Generate 50 rows of random data, each row with 10 cells
  const rows = Array.from({ length: 50 }, () =>
    Array.from({ length: 10 }, () => getRandomString())
  );

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead style={{ position: 'sticky', top: '0px' }}>
        <tr>
          {columns.map((col) => (
            <th key={col} style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((rowData, rowIndex) => (
          <tr key={rowIndex}>
            {rowData.map((cellData, cellIndex) => (
              <td key={cellIndex} style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                {cellData}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default (props:TestComponentProps) => {

  const errorMessage = "";
  const noResults = true;
  const loading = false;

  return (
    <Container
        title={props.title}
        description={props.description}
        errorMessage={errorMessage}
        noResults={noResults}
        loading={loading}
    >
      {RandomTable()}
    </Container>
  );
};
