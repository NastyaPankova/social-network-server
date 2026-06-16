import { roleValues } from './roleValues';

export const defUsers = [
  { email: 'user1@mail.com', password: 'pass1', name: 'name1' },
  { email: 'user2@mail.com', password: 'pass2', name: 'name2' },
  { email: 'user3@mail.com', password: 'pass3', name: 'name3' },
];

export const defRoles = [
  { value: roleValues.ROLE_USER },
  { value: roleValues.ROLE_ADMIN },
];

export const defPosts = [
  { title: 'Title 1', content: 'Content 1', media: 'URL1' },
  { title: 'Title 2', content: 'Content 2', media: 'URL2' },
  { title: 'Title 3', content: 'Content 3', media: 'URL3' },
];
