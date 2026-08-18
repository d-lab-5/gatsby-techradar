import React from 'react';
import { graphql, useStaticQuery, type HeadFC } from 'gatsby';
import { RadarChart } from '@gatsby-techradar/react';
import type { TechradarConfig, ThemeMode } from '@gatsby-techradar/core';
import { ringsFromFlat } from '@gatsby-techradar/core';

/**
 * Track the OS color-scheme preference. Starts at 'light' so the first client
 * render matches the SSR output, then syncs in an effect.
 */
function useColorScheme(): ThemeMode {
  const [mode, setMode] = React.useState<ThemeMode>('light');

  React.useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setMode(query.matches ? 'dark' : 'light');

    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return mode;
}

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
          colorDark
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

  const mode = useColorScheme();

  const config: TechradarConfig = {
    ...data.techradarConfig,
    // GraphQL delivers rings flattened to color/colorDark.
    rings: ringsFromFlat(data.techradarConfig.rings),
    entries: data.allTechradarEntry.nodes.map((node: any) => ({
      ...node,
      id: node.entryId,
    })),
  };

  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <RadarChart config={config} theme={mode} />
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Technology Radar</title>;
