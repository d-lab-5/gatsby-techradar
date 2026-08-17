import React from 'react';
import { graphql, useStaticQuery, type HeadFC } from 'gatsby';
import { RadarChart } from '@gatsby-techradar/react';
import type { TechradarConfig, TechradarEntry } from '@gatsby-techradar/core';

const IndexPage: React.FC = () => {
  const data = useStaticQuery(graphql`
    query {
      techradarConfig {
        title
        date
        quadrants {
          index
          name
        }
        rings {
          index
          name
          color
        }
      }
      allTechradarEntry {
        nodes {
          entryId
          label
          quadrant
          ring
          moved
          active
          link
          description
        }
      }
    }
  `);

  const config: TechradarConfig = {
    ...data.techradarConfig,
    entries: data.allTechradarEntry.nodes.map((node: any) => ({
      ...node,
      id: node.entryId,
    })),
  };

  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <RadarChart config={config} />
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Technology Radar</title>;
