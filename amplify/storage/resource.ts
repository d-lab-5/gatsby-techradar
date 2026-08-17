import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'techradar-exports',
  access: (allow) => ({
    'exports/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  }),
});
