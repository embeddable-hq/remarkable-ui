import { stylesTokensCore } from '../../styles/styles.tokensCore.constants';

export default {
  title: 'Foundations/Size',
};

const stylesSize = Object.fromEntries(
  Object.entries(stylesTokensCore).filter(([k]) => k.startsWith('--TEMP-core-size-')),
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
        {Object.entries(stylesSize).map(([key, value]) => (
          <tr key={key}>
            <td>
              <code>{key}</code>
            </td>
            <td>
              <div
                style={{
                  width: value,
                  height: '50px',
                  backgroundColor: stylesTokensCore['--TEMP-core-color-gray-300'],
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
