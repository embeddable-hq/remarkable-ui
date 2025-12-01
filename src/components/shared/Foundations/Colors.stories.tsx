import { storybookStyleLabel } from '../../../storybook.constants';
import { stylesTokensCore } from '../../../styles/global.tokens';

export default {
  title: 'Foundations/Colors',
};

const stylesColors = Object.fromEntries(
  Object.entries(stylesTokensCore).filter(([k]) => k.startsWith('--em-core-color-')),
);

const style = {
  width: '200px',
  height: '50px',
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
          <th>Value/Preview</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(stylesColors).map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>
              <div
                style={{
                  ...style,
                  backgroundColor: value,
                }}
              >
                <div style={storybookStyleLabel}>{value}</div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
