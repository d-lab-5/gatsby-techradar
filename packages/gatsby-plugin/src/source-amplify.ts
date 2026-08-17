import type { TechradarEntry } from '@gatsby-techradar/core';
import { parseAmplifyRecords } from '@gatsby-techradar/core';

export async function loadAmplifyEntries(
  radarId: string
): Promise<TechradarEntry[]> {
  // Dynamic import to avoid requiring Amplify when using CSV mode
  const { Amplify } = await import('aws-amplify');
  const { generateClient } = await import('aws-amplify/data');

  // Load amplify_outputs.json from the project root
  let outputs: Record<string, unknown>;
  try {
    outputs = require(require('path').resolve('./amplify_outputs.json'));
  } catch {
    throw new Error(
      'amplify_outputs.json not found. Run `npx ampx sandbox` or `npx ampx generate outputs` first.'
    );
  }

  Amplify.configure(outputs as Parameters<typeof Amplify.configure>[0]);
  const client = generateClient();

  const { data: records } = await (client.models as any).TechradarEntry.list({
    filter: { radarId: { eq: radarId } },
  });

  return parseAmplifyRecords(records ?? []);
}
