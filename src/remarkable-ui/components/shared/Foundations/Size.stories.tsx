import { stylesTokensCore } from '../../../styles/styles.tokensCore.constants';

export default {
  title: 'Foundations/✅ Size',
};

const stylesSize = Object.fromEntries(
  Object.entries(stylesTokensCore).filter(([k]) => k.startsWith('--em-core-size--')),
);

const style = {
  height: '25px',
  backgroundColor: stylesTokensCore['--em-core-color-orange--900'],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const Default = () => {
  return (
    <table className="storybook-table">
      <thead>
        <tr>
          <th>Variable Name</th>
          <th>Value</th>
          <th>Preview</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(stylesSize).map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{value}</td>
            <td>
              <div style={{ ...style, width: value }} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
