import { storybookStyleLabel } from '../../../storybook.constants';
import { stylesTokensCore } from '../../../styles/global.tokens';

export default {
  title: 'Foundations/BorderRadius',
};

const stylesBorderRadius = Object.fromEntries(
  Object.entries(stylesTokensCore).filter(([k]) => k.startsWith('--em-core-border-radius--')),
);

const style = {
  width: '100px',
  height: '50px',
  backgroundColor: stylesTokensCore['--em-core-color-gray--1000'],
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
        {Object.entries(stylesBorderRadius).map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>
              <div style={{ ...style, borderRadius: value }}>
                <div style={storybookStyleLabel}>{value}</div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
