import { stylesTokensCore } from '../../styles/styles.tokensCore.constants';

export default {
  title: 'Foundations/Colors',
};

const stylesColors = Object.fromEntries(
  Object.entries(stylesTokensCore).filter(([k]) => k.startsWith('--TEMP-core-color-')),
);

export const Default = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Token</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(stylesColors).map(([key, value]) => (
          <tr key={key}>
            <td>
              <code>{key}</code>
            </td>
            <td>
              <div
                style={{
                  width: '150px',
                  height: '100px',
                  backgroundColor: value,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {value}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
