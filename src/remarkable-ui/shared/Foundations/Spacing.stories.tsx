import { stylesTokensCore } from '../../styles/styles.tokensCore.constants';

export default {
  title: 'Foundations/Spacing',
};

const stylesSpacing = Object.fromEntries(
  Object.entries(stylesTokensCore).filter(([k]) => k.startsWith('--em-core-spacing-')),
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
        {Object.entries(stylesSpacing).map(([key, value]) => (
          <tr key={key}>
            <td>
              <code>{key}</code>
            </td>
            <td>
              <div
                style={{
                  width: value,
                  height: '50px',
                  backgroundColor: stylesTokensCore['--em-core-color-gray-300'],
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
