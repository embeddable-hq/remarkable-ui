import { TableHeaderItem } from './table.types';

const teams = ['Design', 'Engineering', 'Ops', 'Marketing'] as const;
const titles = ['IC', 'Lead', 'Manager', 'Director'] as const;

export type MockEmployee = {
  id: number;
  name: string;
  age: number;
  title: string;
  team: string;
  salary: number;
  email: string;
  location: string;
  object: string;
};

export const mockMakeEmployees = (count = 3): MockEmployee[] =>
  Array.from(
    { length: count },
    (_, i) =>
      ({
        id: i + 1,
        name: `Employee ${i + 1}`,
        title: titles[(i + 1) % titles.length],
        team: teams[(i + 2) % teams.length],
        age: 22 + ((i + 3) % 28),
        salary: 52000 + ((i + 5) % 20) * 2500,
        email: `person${i + 1}@example.com`,
        object: `{"query": {"limit": 100, "total": false, "filters": [{"member": "events.event_id", "operator": "set"}], "measures": ["event_views.event_views"], "timezone": "UTC", "dimensions": [], "renewQuery": false, "timeDimensions": []}`,
        location: `City ${((i + 4) % 10) + 1}`,
      }) as MockEmployee,
  );

export const mockTableHeaders: TableHeaderItem<MockEmployee>[] = [
  {
    id: 'id',
    title: 'Id',
    align: 'right',
  },
  {
    id: 'name',
    title: 'Name',
  },
  { id: 'title', title: 'Title', align: 'right' },
  { id: 'team', title: 'Team', align: 'left' },
  {
    id: 'age',
    title: 'Age',
    align: 'right',
    cell: (cell) => (
      <td style={{ background: cell.value > 29 ? 'lightgreen' : 'lightcoral' }}>
        {cell.value} yrs
      </td>
    ),
  },
  {
    id: 'salary',
    title: 'Salary',
    align: 'right',
  },
  {
    id: 'email',
    title: 'Email',
    align: 'left',
  },
  {
    id: 'location',
    title: 'Location',
    align: 'left',
  },
  {
    id: 'object',
    title: 'Object',
    align: 'left',
  },
];
