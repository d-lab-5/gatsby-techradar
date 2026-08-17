import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  TechradarEntry: a
    .model({
      label: a.string().required(),
      quadrant: a.integer().required(),
      ring: a.integer().required(),
      moved: a.integer().default(0),
      active: a.boolean().default(true),
      link: a.string(),
      description: a.string(),
      radarId: a.string().required(),
    })
    .secondaryIndexes((index) => [
      index('radarId'),
    ])
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated(),
    ]),

  TechradarConfig: a
    .model({
      radarId: a.string().required(),
      title: a.string().required(),
      date: a.string(),
      quadrants: a.json(),
      rings: a.json(),
      published: a.boolean().default(false),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated(),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
