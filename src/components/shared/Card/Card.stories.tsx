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

export const WithTooltip = () => (
  <Card>
    <CardHeader title="Title" subtitle="Subtitle" tooltip="Tooltip" />
    <CardContent>This is the content of the card.</CardContent>
  </Card>
);

export const WithLongTooltip = () => (
  <Card>
    <CardHeader
      title="Title"
      subtitle="Subtitle"
      tooltip="This longer tooltip should align to the end of the info icon so it expands away from right-edge scrollbars."
    />
    <CardContent>This is the content of the card.</CardContent>
  </Card>
);

export const RightEdgeLongTooltip = () => (
  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <div style={{ width: 300 }}>
      <Card>
        <CardHeader
          title="Right edge card"
          subtitle="Hover the info icon"
          tooltip="This longer tooltip should stay readable when the card is close to the right edge of the viewport."
        />
        <CardContent>
          This story demonstrates long tooltip alignment near the right edge.
        </CardContent>
      </Card>
    </div>
  </div>
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
