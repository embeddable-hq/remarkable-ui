import { getStyle } from '../../styles/styles.utils';

export const getChartColors = (): string[] => [
  getStyle('--em-sem-chart-color--1'),
  getStyle('--em-sem-chart-color--2'),
  getStyle('--em-sem-chart-color--3'),
  getStyle('--em-sem-chart-color--4'),
  getStyle('--em-sem-chart-color--5'),
  getStyle('--em-sem-chart-color--6'),
  getStyle('--em-sem-chart-color--7'),
  getStyle('--em-sem-chart-color--8'),
  getStyle('--em-sem-chart-color--9'),
  getStyle('--em-sem-chart-color--10'),
];

export const getChartContrastColors = (): string[] => [
  getStyle('--em-sem-chart-color--1'),
  getStyle('--em-sem-chart-color--4'),
  getStyle('--em-sem-chart-color--7'),
  getStyle('--em-sem-chart-color--10'),
];
