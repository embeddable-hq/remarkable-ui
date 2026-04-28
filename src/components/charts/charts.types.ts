import { InteractionItem } from 'chart.js';

export type ChartClickArgs = {
  event: React.MouseEvent<HTMLCanvasElement>;
  elementAtEvent: InteractionItem[];
  elementsAtEvent: InteractionItem[];
  datasetAtEvent: InteractionItem[];
};
