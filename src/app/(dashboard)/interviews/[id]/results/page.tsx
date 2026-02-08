import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, RefreshCw, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnalyticsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Get interview
  const { data: interview, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !interview) {
    notFound();
  }

  // Get analytics cache
  const { data: analytics } = await supabase
    .from('analytics_cache')
    .select('*')
    .eq('interview_id', id)
    .single();

  // Get all summaries for this interview
  const { data: participants } = await supabase
    .from('participants')
    .select(`
      id,
      email,
      status,
      completed_at,
      summaries (
        free_form_insights,
        key_themes,
        notable_quotes,
        actionable_insights,
        participant_sentiment
      )
    `)
    .eq('interview_id', id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false });

  const completedCount = participants?.length || 0;

  // Collect all insights across participants
  const allInsights: string[] = [];
  const allQuotes: Array<{ text: string; context: string; participant: string }> = [];

  participants?.forEach((p) => {
    const summary = Array.isArray(p.summaries) ? p.summaries[0] : p.summaries;
    if (summary) {
      (summary.actionable_insights || []).forEach((insight: string) => {
        if (!allInsights.includes(insight)) {
          allInsights.push(insight);
        }
      });
      (summary.notable_quotes || []).forEach((quote: { text: string; context: string }) => {
        allQuotes.push({ ...quote, participant: p.email });
      });
    }
  });

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href={`/interviews/${id}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Interview
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl text-[var(--foreground)]">
              Analytics: {interview.title}
            </h1>
            <p className="text-[var(--muted-foreground)] text-sm mt-2">
              {completedCount} completed interviews
            </p>
          </div>
          <Button variant="secondary" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {completedCount === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
              No completed interviews yet
            </h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Analytics will appear here once participants complete the interview
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Themes */}
            <Card>
              <CardHeader>
                <CardTitle>Key Themes</CardTitle>
                <CardDescription>
                  Most common themes across all interviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.aggregate_themes && analytics.aggregate_themes.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.aggregate_themes.slice(0, 10).map((theme: { theme: string; count: number }, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-[var(--foreground)]">{theme.theme}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-[var(--muted)] overflow-hidden">
                            <div
                              className="h-full bg-emerald-500"
                              style={{ width: `${(theme.count / completedCount) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-[var(--muted-foreground)] w-8">
                            {theme.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--muted-foreground)]">No themes identified yet</p>
                )}
              </CardContent>
            </Card>

            {/* Notable Quotes */}
            <Card>
              <CardHeader>
                <CardTitle>Notable Quotes</CardTitle>
                <CardDescription>
                  Standout responses from participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allQuotes.length > 0 ? (
                  <div className="space-y-4">
                    {allQuotes.slice(0, 5).map((quote, i) => (
                      <div key={i} className="border-l-2 border-emerald-500 pl-4">
                        <p className="text-sm font-serif text-[var(--foreground)] italic">
                          &ldquo;{quote.text}&rdquo;
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                          {quote.context}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)] opacity-70 mt-1">
                          — {quote.participant}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--muted-foreground)]">No notable quotes yet</p>
                )}
              </CardContent>
            </Card>

            {/* Actionable Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Actionable Insights</CardTitle>
                <CardDescription>
                  Recommendations based on interview analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allInsights.length > 0 ? (
                  <ul className="space-y-2">
                    {allInsights.slice(0, 10).map((insight, i) => (
                      <li key={i} className="flex gap-2 text-sm text-[var(--foreground)]">
                        <TrendingUp className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[var(--muted-foreground)]">No insights generated yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted-foreground)]">Completed</span>
                  <span className="text-sm text-emerald-500">{completedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted-foreground)]">Themes Found</span>
                  <span className="text-sm text-[var(--foreground)]">
                    {analytics?.aggregate_themes?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted-foreground)]">Quotes Captured</span>
                  <span className="text-sm text-[var(--foreground)]">{allQuotes.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Participants */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {participants?.slice(0, 5).map((p) => (
                    <Link
                      key={p.id}
                      href={`/interviews/${id}/participants/${p.id}`}
                      className="flex items-center justify-between p-2 -mx-2 hover:bg-[var(--muted)] transition-colors"
                    >
                      <span className="text-sm text-[var(--foreground)] truncate">
                        {p.email}
                      </span>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {p.completed_at ? formatDate(p.completed_at) : ''}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
