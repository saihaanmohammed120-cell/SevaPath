import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@astryxdesign/core/Button';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Card } from '@astryxdesign/core/Card';
import { TabList, Tab } from '@astryxdesign/core/TabList';
import { Banner } from '@astryxdesign/core/Banner';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { searchServices, listServices } from '../lib/api';
import { useLang } from '../context/LanguageContext';
import { useJourney } from '../context/JourneyContext';
import { getService } from '../lib/api';


export default function Discover() {
  const { t, lang } = useLang();
  const nav = useNavigate();
  const { startJourney } = useJourney();
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const life = params.get('life') || '';
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all | central | state | test

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError('');
      try {
        let data;
        if (!q && !life) {
          data = await listServices();
          if (!cancelled) setResults(data.services || []);
        } else {
          data = await searchServices({ query: q, life_situation: life || null });
          if (!cancelled) setResults(data.results || []);
        }
      } catch (e) {
        if (!cancelled) setError('Could not reach SevaPath — please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [q, life, lang]);

  const visible = useMemo(() => {
    if (filter === 'all') return results;
    return results.filter((r) => r.jurisdiction?.level === filter);
  }, [results, filter]);

  const counts = useMemo(() => ({
    all: results.length,
    central: results.filter((r) => r.jurisdiction?.level === 'central').length,
    state: results.filter((r) => r.jurisdiction?.level === 'state').length,
  }), [results]);

  async function open(item) {
    const full = await getService(item.id);
    const id = startJourney(full);
    nav(`/journey/${id}`);
  }

  const empty = !loading && visible.length === 0;

  const filterOptions = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'central', label: 'Central government', count: counts.central },
    { id: 'state', label: 'State / UT', count: counts.state },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-16">
      {life ? (
        <div className="mb-8">
          <Text type="label" color="accent" className="mb-2">Life Situation</Text>
          <Heading level={1}>
            {t.home.lifeSituations.find((s) => s.id === life)?.label || life}
          </Heading>
          <Text type="large" as="p" className="mt-2">
            Here are some things you may want to take care of.
          </Text>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm text-stone-500 mb-3">
            <Search className="w-4 h-4" aria-hidden="true" />
            <Text type="supporting">{q ? `Results for “${q}”` : 'Browse services'}</Text>
          </div>
          <Heading level={1} className="mb-6">
            {results.length === 0 && !loading
              ? "I couldn't find a matching verified service"
              : "Which of these sounds right?"}
          </Heading>
        </>
      )}

      {results.length > 0 && (
        <div className="mb-6">
          <TabList value={filter} onChange={setFilter} aria-label="Filter by jurisdiction">
            {filterOptions.filter((o) => o.count > 0 || o.id === 'all').map((o) => (
              <Tab
                key={o.id}
                value={o.id}
                label={o.label}
                data-testid={`filter-${o.id}`}
                endContent={<span className="text-[11px] opacity-70">{o.count}</span>}
              />
            ))}
          </TabList>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-stone-500">
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          <Text>Searching…</Text>
        </div>
      )}

      {error && (
        <Banner status="error" title={error} collapsible={false} />
      )}

      {empty && !error && (
        <EmptyState
          title="I couldn't find a matching verified service"
          description="SevaPath's catalogue does not have a verified match for this yet. Try describing the outcome more directly (e.g. “learner licence” or “scholarship”), or open the SevaPath Guide for help. SevaPath never guesses or fabricates services. Verified content is added by the SevaPath team."
          actions={<Button label="Back to home" variant="primary" onClick={() => nav('/')} />}
        />
      )}

      <div className="space-y-8 mt-4">
        {Object.entries(
          visible.reduce((acc, r) => {
            const cat = r.category || 'Other';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(r);
            return acc;
          }, {})
        )
        .sort(([catA], [catB]) => {
          const order = [
            'Education & Scholarships',
            'Identity & Documents',
            'Work & Employment',
            'Travel',
            'Mobility',
            'Health & Welfare',
            'Digital Documents',
            'State & Local',
            'Other'
          ];
          const idxA = order.indexOf(catA);
          const idxB = order.indexOf(catB);
          const a = idxA === -1 ? 999 : idxA;
          const b = idxB === -1 ? 999 : idxB;
          return a - b;
        })
        .map(([category, items]) => (
          <div key={category}>
            <Heading level={2} className="mb-4 px-1 border-b border-border pb-2">
              {category}
            </Heading>
            <ul className="space-y-3">
              {items.map((r, i) => (
                <motion.li 
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.01, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    type="button"
                    onClick={() => open(r)}
                    data-testid={`discover-result-${r.id}`}
                    className="group w-full text-left"
                  >
                    <Card>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Heading level={3}>
                            {r.short_label}
                          </Heading>
                          <Text type="body" as="p" className="mt-1">
                            {r.description}
                          </Text>
                          <Text type="supporting" as="p" className="mt-2">{r.authority_name}</Text>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-primary transition-colors transform group-hover:translate-x-1" aria-hidden="true" />
                        </div>
                      </div>
                    </Card>
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
