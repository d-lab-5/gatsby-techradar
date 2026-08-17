import type { GatsbyNode } from 'gatsby';
import type { TechradarPluginOptions, TechradarEntry, QuadrantConfig, RingConfig } from '@gatsby-techradar/core';
import {
  DEFAULT_QUADRANTS,
  DEFAULT_RINGS,
  assignSequentialIds,
} from '@gatsby-techradar/core';
import { loadCsvEntries } from './src/source-csv';

export const pluginOptionsSchema: GatsbyNode['pluginOptionsSchema'] = ({ Joi }) => {
  return Joi.object({
    source: Joi.string().valid('csv', 'amplify').default('csv'),
    csvPath: Joi.string().when('source', {
      is: 'csv',
      then: Joi.required(),
    }),
    radarId: Joi.string().when('source', {
      is: 'amplify',
      then: Joi.required(),
    }),
    radarName: Joi.string().default('Technology Radar'),
    quadrants: Joi.array().items(
      Joi.object({
        index: Joi.number().required(),
        name: Joi.string().required(),
      })
    ),
    rings: Joi.array().items(
      Joi.object({
        index: Joi.number().required(),
        name: Joi.string().required(),
        color: Joi.string().required(),
      })
    ),
  });
};

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({
  actions,
}) => {
  const { createTypes } = actions;
  createTypes(`
    type TechradarEntry implements Node {
      entryId: String!
      label: String!
      quadrant: Int!
      ring: Int!
      moved: Int!
      active: Boolean!
      link: String
      description: String
    }

    type TechradarConfig implements Node {
      title: String!
      date: String
      quadrants: [TechradarQuadrant!]!
      rings: [TechradarRing!]!
    }

    type TechradarQuadrant {
      index: Int!
      name: String!
    }

    type TechradarRing {
      index: Int!
      name: String!
      color: String!
    }
  `);
};

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  { actions, createNodeId, createContentDigest },
  options
) => {
  const { createNode } = actions;
  const pluginOptions = options as unknown as TechradarPluginOptions & {
    radarName?: string;
  };

  const quadrants: QuadrantConfig[] = pluginOptions.quadrants ?? DEFAULT_QUADRANTS;
  const rings: RingConfig[] = pluginOptions.rings ?? DEFAULT_RINGS;

  let entries: TechradarEntry[];

  if (pluginOptions.source === 'amplify') {
    const { loadAmplifyEntries } = await import('./src/source-amplify');
    entries = await loadAmplifyEntries(pluginOptions.radarId ?? 'latest');
  } else {
    entries = loadCsvEntries(pluginOptions.csvPath!, quadrants, rings);
  }

  // Assign sequential IDs
  assignSequentialIds(entries);

  // Create entry nodes
  for (const entry of entries) {
    createNode({
      ...entry,
      entryId: entry.id,
      id: createNodeId(`techradar-entry-${entry.id}`),
      internal: {
        type: 'TechradarEntry',
        contentDigest: createContentDigest(entry),
      },
    });
  }

  // Create config node
  createNode({
    title: pluginOptions.radarName ?? 'Technology Radar',
    date: new Date().toISOString().split('T')[0],
    quadrants,
    rings,
    id: createNodeId('techradar-config'),
    internal: {
      type: 'TechradarConfig',
      contentDigest: createContentDigest({ quadrants, rings }),
    },
  });
};
