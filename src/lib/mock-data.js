// Mock data for the Trello clone
// Removed TypeScript interfaces - data shape is:
// Card: { id, title, description?, completed? }
// List: { id, title, cards: Card[] }
// Board: { id, title, lists: List[] }

export const boards = [
  {
    id: '1',
    title: 'Project Alpha',
    lists: [
      {
        id: 'l1',
        title: 'To Do',
        cards: [
          { id: 'c1', title: 'Research competitors', description: 'Analyze top 5 competitors' },
          { id: 'c2', title: 'Define user personas' },
          { id: 'c3', title: 'Create wireframes' },
        ],
      },
      {
        id: 'l2',
        title: 'In Progress',
        cards: [
          { id: 'c4', title: 'Design landing page', description: 'Hero section and features' },
          { id: 'c5', title: 'Set up database schema' },
        ],
      },
      {
        id: 'l3',
        title: 'Review',
        cards: [
          { id: 'c6', title: 'Code review: Auth module' },
        ],
      },
      {
        id: 'l4',
        title: 'Done',
        cards: [
          { id: 'c7', title: 'Project kickoff meeting', completed: true },
          { id: 'c8', title: 'Set up development environment', completed: true },
          { id: 'c9', title: 'Create GitHub repository', completed: true },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Marketing Campaign',
    lists: [
      {
        id: 'l5',
        title: 'Ideas',
        cards: [
          { id: 'c10', title: 'Social media strategy' },
          { id: 'c11', title: 'Email newsletter design' },
        ],
      },
      {
        id: 'l6',
        title: 'In Progress',
        cards: [
          { id: 'c12', title: 'Blog post drafts' },
        ],
      },
      {
        id: 'l7',
        title: 'Completed',
        cards: [],
      },
    ],
  },
  {
    id: '3',
    title: 'Personal Tasks',
    lists: [],
  },
]
