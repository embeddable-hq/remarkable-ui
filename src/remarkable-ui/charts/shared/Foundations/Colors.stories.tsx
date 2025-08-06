import { stylesColors } from '../../../styles/styles.constants';

export default {
  title: 'Foundations/Colors',
};

export const Default = () => {
  return Object.entries(stylesColors).map(([key, value]) => (
    <div key={key} style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
      <div
        style={{
          backgroundColor: value,
          borderRadius: '100%',
          width: '100px',
          height: '100px',
          border: '1px solid black',
        }}
      />
      <div>
        <strong>{key}</strong>
        <br />
        <code>{value}</code>
      </div>
    </div>
  ));
};
