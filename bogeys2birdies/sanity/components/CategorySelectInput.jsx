import { Card, Select, Spinner, Stack, Text } from '@sanity/ui';
import { set, unset, useClient } from 'sanity';
import { useEffect, useMemo, useState } from 'react';

export function CategorySelectInput(props) {
  const { id, onChange, readOnly, value } = props;
  const client = useClient({ apiVersion: '2026-08-14' });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const results = await client.fetch('*[_type == "category"] | order(title asc){_id, title}');
        if (!cancelled) setCategories(results);
      } catch (fetchError) {
        if (!cancelled) setError(fetchError);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, [client]);

  const selectedId = value?._ref || '';
  const selectedStillExists = useMemo(
    () => !selectedId || categories.some((category) => category._id === selectedId),
    [categories, selectedId],
  );

  if (loading) {
    return (
      <Card padding={3} tone="transparent">
        <Stack space={3}>
          <Spinner muted />
          <Text size={1} muted>Loading categories...</Text>
        </Stack>
      </Card>
    );
  }

  if (error) {
    return (
      <Card padding={3} radius={2} tone="critical">
        <Text size={1}>Categories could not be loaded. Open the Categories section to check your category documents.</Text>
      </Card>
    );
  }

  if (!categories.length) {
    return (
      <Card padding={3} radius={2} tone="caution">
        <Text size={1}>No categories exist yet. Create categories from the Categories section, then return to this article.</Text>
      </Card>
    );
  }

  return (
    <Stack space={2}>
      <Select
        id={id}
        disabled={readOnly}
        value={selectedId}
        onChange={(event) => {
          const nextId = event.currentTarget.value;
          onChange(nextId ? set({ _type: 'reference', _ref: nextId }) : unset());
        }}
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>{category.title}</option>
        ))}
      </Select>
      {!selectedStillExists && (
        <Text size={1} muted>The selected category no longer exists. Choose another category.</Text>
      )}
    </Stack>
  );
}
