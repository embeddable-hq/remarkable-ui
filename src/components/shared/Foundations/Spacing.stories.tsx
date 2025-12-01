import { stylesTokensCore } from '../../../styles/global.tokens';

export default {
  title: 'Foundations/Spacing',
};

const stylesSpacing = Object.fromEntries(
  Object.entries(stylesTokensCore).filter(([k]) => k.startsWith('--em-core-spacing--')),
);

const style = {
  height: '25px',
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
          <th>Value</th>
          <th>Preview</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(stylesSpacing).map(([key, value]) => (
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
