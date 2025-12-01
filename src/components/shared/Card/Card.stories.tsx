import type { Meta } from '@storybook/react-webpack5';
import { Card, CardContent, CardHeader } from './Card';
import { CardFeedback } from './CardFeedback/CardFeedback';
import { IconBoltFilled } from '@tabler/icons-react';

const meta = {
  title: 'Shared/Card',
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;

export const Default = () => (
  <Card>
    <CardHeader title="Title" subtitle="Subtitle" />
    <CardContent>This is the content of the card.</CardContent>
  </Card>
);

export const LongTitle = () => (
  <div style={{ maxWidth: 300 }}>
    <Card>
      <CardHeader
        title="This is the title of the Card component of remarkable-ui"
        subtitle="This is the subtitle of the Card component of remarkable-ui"
      />
      <CardContent>This is the content of the Card component of remarkable-ui</CardContent>
    </Card>
  </div>
);

export const FeedbackInfo = () => (
  <Card>
    <CardHeader title="Title" subtitle="Subtitle" />
    <CardContent>
      <CardFeedback
        icon={IconBoltFilled}
        title="It's a bit empty here."
        message="Try adding something."
      />
    </CardContent>
  </Card>
);

export const FeedbackError = () => (
  <Card>
    <CardHeader title="Title" subtitle="Subtitle" />
    <CardContent>
      <CardFeedback
        variant="error"
        icon={IconBoltFilled}
        title="Something went wrong"
        message="Please try again."
      />
    </CardContent>
  </Card>
);

export const Resize = () => (
  <div style={{ width: '250px', height: '250px', resize: 'both', overflow: 'auto' }}>
    <Card>
      <CardHeader title="Title" subtitle="Subtitle" />
      <CardContent>
        <CardFeedback
          icon={IconBoltFilled}
          title="It's a bit empty here."
          message="Try adding something."
        />
      </CardContent>
    </Card>
  </div>
);
