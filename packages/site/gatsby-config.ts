import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  siteMetadata: {
    title: 'Technology Radar',
    siteUrl: 'https://techradar.example.com',
  },
  plugins: [
    {
      resolve: 'gatsby-source-techradar',
      options: {
        source: process.env.TECHRADAR_SOURCE || 'csv',
        csvPath: './src/data/radar.csv',
        radarId: process.env.TECHRADAR_RADAR_ID || 'latest',
        radarName: 'Technology Radar',
        quadrants: [
          { index: 0, name: 'Languages & Frameworks' },
          { index: 1, name: 'Infrastructure' },
          { index: 2, name: 'Datastores' },
          { index: 3, name: 'Data Management' },
        ],
        rings: [
          { index: 0, name: 'ADOPT', color: '#5ba300' },
          { index: 1, name: 'TRIAL', color: '#009eb0' },
          { index: 2, name: 'ASSESS', color: '#c7ba00' },
          { index: 3, name: 'HOLD', color: '#e09b96' },
        ],
      },
    },
  ],
};

export default config;
