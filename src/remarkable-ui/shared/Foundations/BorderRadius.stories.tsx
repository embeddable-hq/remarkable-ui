import { stylesTokensCore } from '../../styles/styles.tokensCore.constants';

export default {
  title: 'Foundations/BorderRadius',
};

const stylesBorderRadius = Object.fromEntries(
  Object.entries(stylesTokensCore).filter(([k]) => k.startsWith('--TEMP-core-border-radius-')),
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
        {Object.entries(stylesBorderRadius).map(([key, value]) => (
          <tr key={key}>
            <td>
              <code>{key}</code>
            </td>
            <td>
              <div
                style={{
                  width: '150px',
                  height: '100px',
                  borderRadius: value,
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
