import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
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
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Life Situation</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
            {t.home.lifeSituations.find((s) => s.id === life)?.label || life}
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 mt-2">
            Here are some things you may want to take care of.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm text-stone-500 mb-3">
            <Search className="w-4 h-4" aria-hidden="true" />
            {q ? `Results for “${q}”` : 'Browse services'}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-6">
            {results.length === 0 && !loading
              ? "I couldn't find a matching verified service"
              : "Which of these sounds right?"}
          </h1>
        </>
      )}

      {results.length > 0 && (
        <div
          className="flex flex-wrap gap-2 mb-6"
          role="tablist"
          aria-label="Filter by jurisdiction"
        >
          {filterOptions.filter((o) => o.count > 0 || o.id === 'all').map((o) => (
            <button
              key={o.id}
              type="button"
              role="tab"
              aria-selected={filter === o.id}
              onClick={() => setFilter(o.id)}
              data-testid={`filter-${o.id}`}
              className={`min-h-[40px] px-3 rounded-full text-sm font-medium border transition-colors ${
                filter === o.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-stone-700 dark:text-stone-300 border-border hover:border-primary/40'
              }`}
            >
              {o.label}
              <span className="ml-1.5 text-[11px] opacity-70">{o.count}</span>
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-stone-500">
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          Searching…
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive flex gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5" aria-hidden="true" />
          {error}
        </div>
      )}

      {empty && !error && (
        <div className="rounded-lg border border-border bg-card p-6 text-stone-700 dark:text-stone-300 space-y-3">
          <p>
            SevaPath's catalogue does not have a verified match for this yet.
            Try describing the outcome more directly (e.g. "learner licence"
            or "scholarship"), or open the SevaPath Guide for help.
          </p>
          <p className="text-xs text-stone-500">
            SevaPath never guesses or fabricates services. Verified content is
            added by the SevaPath team.
          </p>
          <Button onClick={() => nav('/')}>Back to home</Button>
        </div>
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
            <h2 className="text-xl font-display font-bold text-stone-900 dark:text-stone-100 mb-4 px-1 border-b border-border pb-2">
              {category}
            </h2>
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
                    className="w-full text-left rounded-lg border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display font-semibold text-lg text-stone-900 dark:text-stone-100 group-hover:text-primary transition-colors">
                            {r.short_label}
                          </h3>

                        </div>
                        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                          {r.description}
                        </p>
                        <p className="text-xs text-stone-500 mt-2">{r.authority_name}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">

                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-primary transition-colors transform group-hover:translate-x-1" aria-hidden="true" />
                      </div>
                    </div>
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
