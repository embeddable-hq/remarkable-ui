import Card from '../../shared/Card';
import type { TestComponentProps } from './TestComponent.emb';

export default (props:TestComponentProps) => {

  return (
    <Card
        title={props.title}
        description={props.description}
    >
    </Card>
  );
};
