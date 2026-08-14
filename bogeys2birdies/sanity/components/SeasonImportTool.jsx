'use client';

import { Button, Card, Container, Flex, Heading, Stack, Text } from '@sanity/ui';
import { useState } from 'react';
import { useClient } from 'sanity';
import { importSeasonData } from '../lib/seasonImport';

const maximumFileSize = 2 * 1024 * 1024;
function preview(data) {
  if (!data || data.version !== 1 || !data.player || !data.season || !data.summary || !Array.isArray(data.rounds)) throw new Error('This is not a valid Precision Golf season export.');
  return { player: data.player.name || 'Unknown player', year: data.season.year, rounds: Number(data.season.includedRoundCount), handicap: Number(data.player.currentHandicapIndex), exportedAt: data.exportedAt };
}
export function SeasonImportTool() {
  const client = useClient({ apiVersion: '2026-08-14' });
  const [data, setData] = useState(null);
  const [details, setDetails] = useState(null);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  async function selectFile(event) {
    const file = event.target.files?.[0];
    setData(null); setDetails(null); setStatus(null); setFileName(file?.name || '');
    if (!file) return;
    try {
      if (file.size > maximumFileSize) throw new Error('The JSON file must be smaller than 2 MB.');
      const parsed = JSON.parse(await file.text());
      const nextDetails = preview(parsed);
      if (!Number.isFinite(nextDetails.rounds) || !Number.isFinite(nextDetails.handicap)) throw new Error('The export is missing its round count or handicap.');
      setData(parsed); setDetails(nextDetails);
    } catch (error) { setStatus({ tone: 'critical', message: error instanceof Error ? error.message : 'The file could not be read.' }); }
  }
  async function runImport() {
    if (!data) return;
    setBusy(true); setStatus(null);
    try {
      const result = await importSeasonData(client, data);
      setStatus({ tone: 'positive', message: `Imported ${result.rounds} rounds. Current handicap: ${result.currentHandicap.toFixed(1)}. The website will update automatically within one minute.` });
    } catch (error) { setStatus({ tone: 'critical', message: error instanceof Error ? error.message : 'The season import failed.' }); }
    finally { setBusy(false); }
  }
  return <Container width={1} padding={4} sizing="border"><Stack space={5}>
    <Stack space={3}><Heading as="h1" size={3}>Import Precision Golf data</Heading><Text muted>Upload the complete JSON season export. Review the summary, then import it to update the homepage and Data page.</Text></Stack>
    <Card border padding={4} radius={2}><Stack space={3}><Text weight="semibold">Choose a JSON export</Text><input aria-label="Precision Golf JSON file" type="file" accept="application/json,.json" onChange={selectFile} disabled={busy} />{fileName && <Text size={1} muted>Selected: {fileName}</Text>}</Stack></Card>
    {details && <Card border padding={4} radius={2} tone="primary"><Stack space={3}><Heading as="h2" size={2}>Check before importing</Heading><Text>Player: {details.player}</Text><Text>Season: {details.year}</Text><Text>Rounds: {details.rounds}</Text><Text>Current handicap: {details.handicap.toFixed(1)}</Text>{details.exportedAt && <Text size={1} muted>Exported: {new Date(details.exportedAt).toLocaleString('en-GB')}</Text>}<Flex justify="flex-start"><Button text={busy ? 'Importing…' : 'Import and update website'} tone="positive" onClick={runImport} disabled={busy} /></Flex></Stack></Card>}
    {status && <Card padding={4} radius={2} tone={status.tone}><Text weight="semibold">{status.message}</Text></Card>}
  </Stack></Container>;
}
