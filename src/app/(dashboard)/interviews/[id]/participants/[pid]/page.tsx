'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Lightbulb, Download, FileText, FileIcon, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface Message {
  id: string;
  role: string;
  content: string;
  thinking?: string;
}

interface Transcript {
  messages: Message[];
}

interface Summary {
  free_form_insights: string;
  key_themes: string[];
  participant_sentiment: string;
  notable_quotes: { text: string; context: string }[];
  actionable_insights: string[];
}

interface Participant {
  id: string;
  email: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  interviews: { title: string } | { title: string }[];
  transcripts: Transcript | Transcript[];
  summaries: Summary | Summary[];
}

export default function ParticipantDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const pid = params.pid as string;

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipant = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('participants')
        .select(`
          *,
          interviews (title),
          transcripts (*),
          summaries (*)
        `)
        .eq('id', pid)
        .eq('interview_id', id)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      setParticipant(data as Participant);
      setLoading(false);
    };

    fetchParticipant();
  }, [id, pid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#A1A1AA]">Loading...</div>
      </div>
    );
  }

  if (!participant) {
    notFound();
  }

  const transcript = Array.isArray(participant.transcripts)
    ? participant.transcripts[0]
    : participant.transcripts;
  const summary = Array.isArray(participant.summaries)
    ? participant.summaries[0]
    : participant.summaries;
  const interview = Array.isArray(participant.interviews)
    ? participant.interviews[0]
    : participant.interviews;

  // Export functions
  const generateTranscriptText = () => {
    if (!transcript?.messages) return '';

    const lines: string[] = [];
    lines.push(`Interview Transcript`);
    lines.push(`==================`);
    lines.push(`Participant: ${participant.email}`);
    lines.push(`Interview: ${interview?.title || 'Unknown'}`);
    lines.push(`Date: ${formatDate(participant.started_at)}`);
    lines.push(`Status: ${participant.status}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    transcript.messages.forEach((message) => {
      const role = message.role === 'agent' ? 'Census' : 'Participant';
      lines.push(`[${role}]`);
      lines.push(message.content);
      lines.push('');
    });

    if (summary) {
      lines.push('---');
      lines.push('');
      lines.push('SUMMARY');
      lines.push('=======');
      lines.push('');
      lines.push(summary.free_form_insights);
      lines.push('');

      if (summary.key_themes?.length) {
        lines.push('Key Themes: ' + summary.key_themes.join(', '));
        lines.push('');
      }

      if (summary.participant_sentiment) {
        lines.push('Sentiment: ' + summary.participant_sentiment);
        lines.push('');
      }

      if (summary.notable_quotes?.length) {
        lines.push('Notable Quotes:');
        summary.notable_quotes.forEach((quote, i) => {
          lines.push(`  ${i + 1}. "${quote.text}"`);
          lines.push(`     Context: ${quote.context}`);
        });
        lines.push('');
      }

      if (summary.actionable_insights?.length) {
        lines.push('Actionable Insights:');
        summary.actionable_insights.forEach((insight, i) => {
          lines.push(`  ${i + 1}. ${insight}`);
        });
      }
    }

    return lines.join('\n');
  };

  const exportAsTxt = () => {
    setExporting('txt');
    const content = generateTranscriptText();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${participant.email.split('@')[0]}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExporting(null);
  };

  const exportAsDocx = async () => {
    setExporting('docx');
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle } = await import('docx');

      const children: (typeof Paragraph.prototype)[] = [];

      // Title
      children.push(new Paragraph({
        text: 'Interview Transcript',
        heading: HeadingLevel.TITLE,
      }));

      // Metadata
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'Participant: ', bold: true }),
          new TextRun(participant.email),
        ],
      }));
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'Interview: ', bold: true }),
          new TextRun(interview?.title || 'Unknown'),
        ],
      }));
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'Date: ', bold: true }),
          new TextRun(formatDate(participant.started_at)),
        ],
      }));
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'Status: ', bold: true }),
          new TextRun(participant.status),
        ],
      }));

      children.push(new Paragraph({ text: '' }));
      children.push(new Paragraph({
        text: 'Conversation',
        heading: HeadingLevel.HEADING_1,
      }));

      // Messages
      transcript?.messages?.forEach((message) => {
        const role = message.role === 'agent' ? 'Census' : 'Participant';
        children.push(new Paragraph({
          children: [
            new TextRun({
              text: `[${role}]`,
              bold: true,
              color: message.role === 'agent' ? '10B981' : '71717A',
            }),
          ],
          spacing: { before: 200 },
        }));

        children.push(new Paragraph({
          text: message.content,
        }));
      });

      // Summary section
      if (summary) {
        children.push(new Paragraph({ text: '' }));
        children.push(new Paragraph({
          text: 'Summary',
          heading: HeadingLevel.HEADING_1,
        }));
        children.push(new Paragraph({
          text: summary.free_form_insights,
        }));

        if (summary.key_themes?.length) {
          children.push(new Paragraph({ text: '' }));
          children.push(new Paragraph({
            children: [
              new TextRun({ text: 'Key Themes: ', bold: true }),
              new TextRun(summary.key_themes.join(', ')),
            ],
          }));
        }

        if (summary.participant_sentiment) {
          children.push(new Paragraph({
            children: [
              new TextRun({ text: 'Sentiment: ', bold: true }),
              new TextRun(summary.participant_sentiment),
            ],
          }));
        }

        if (summary.notable_quotes?.length) {
          children.push(new Paragraph({ text: '' }));
          children.push(new Paragraph({
            text: 'Notable Quotes',
            heading: HeadingLevel.HEADING_2,
          }));
          summary.notable_quotes.forEach((quote) => {
            children.push(new Paragraph({
              children: [
                new TextRun({ text: `"${quote.text}"`, italics: true }),
              ],
              indent: { left: 720 },
              border: {
                left: { style: BorderStyle.SINGLE, size: 12, color: '10B981' },
              },
            }));
            children.push(new Paragraph({
              children: [
                new TextRun({ text: quote.context, color: '9CA3AF', size: 20 }),
              ],
              indent: { left: 720 },
            }));
          });
        }

        if (summary.actionable_insights?.length) {
          children.push(new Paragraph({ text: '' }));
          children.push(new Paragraph({
            text: 'Actionable Insights',
            heading: HeadingLevel.HEADING_2,
          }));
          summary.actionable_insights.forEach((insight, i) => {
            children.push(new Paragraph({
              text: `${i + 1}. ${insight}`,
              indent: { left: 360 },
            }));
          });
        }
      }

      const doc = new Document({
        sections: [{ children }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcript-${participant.email.split('@')[0]}-${new Date().toISOString().split('T')[0]}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting DOCX:', error);
    }
    setExporting(null);
  };

  const exportAsPdf = async () => {
    setExporting('pdf');
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      let y = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;

      const addText = (text: string, options: { bold?: boolean; italic?: boolean; size?: number; color?: [number, number, number] } = {}) => {
        const { bold = false, italic = false, size = 10, color = [0, 0, 0] } = options;
        doc.setFontSize(size);
        doc.setTextColor(...color);

        if (bold && italic) {
          doc.setFont('helvetica', 'bolditalic');
        } else if (bold) {
          doc.setFont('helvetica', 'bold');
        } else if (italic) {
          doc.setFont('helvetica', 'italic');
        } else {
          doc.setFont('helvetica', 'normal');
        }

        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line: string) => {
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, margin, y);
          y += size * 0.5;
        });
      };

      const addSpace = (space: number = 5) => {
        y += space;
      };

      // Title
      addText('Interview Transcript', { bold: true, size: 18 });
      addSpace(8);

      // Metadata
      addText(`Participant: ${participant.email}`, { size: 10 });
      addText(`Interview: ${interview?.title || 'Unknown'}`, { size: 10 });
      addText(`Date: ${formatDate(participant.started_at)}`, { size: 10 });
      addText(`Status: ${participant.status}`, { size: 10 });
      addSpace(10);

      // Conversation header
      addText('Conversation', { bold: true, size: 14 });
      addSpace(5);

      // Messages
      transcript?.messages?.forEach((message) => {
        const role = message.role === 'agent' ? 'Census' : 'Participant';
        const roleColor: [number, number, number] = message.role === 'agent' ? [16, 185, 129] : [113, 113, 122];

        addText(`[${role}]`, { bold: true, size: 10, color: roleColor });
        addText(message.content, { size: 10 });
        addSpace(5);
      });

      // Summary
      if (summary) {
        addSpace(10);
        addText('Summary', { bold: true, size: 14 });
        addSpace(5);
        addText(summary.free_form_insights, { size: 10 });
        addSpace(5);

        if (summary.key_themes?.length) {
          addText(`Key Themes: ${summary.key_themes.join(', ')}`, { size: 10 });
          addSpace(3);
        }

        if (summary.participant_sentiment) {
          addText(`Sentiment: ${summary.participant_sentiment}`, { size: 10 });
          addSpace(3);
        }

        if (summary.notable_quotes?.length) {
          addSpace(5);
          addText('Notable Quotes', { bold: true, size: 12 });
          addSpace(3);
          summary.notable_quotes.forEach((quote) => {
            addText(`"${quote.text}"`, { italic: true, size: 10 });
            addText(quote.context, { size: 9, color: [156, 163, 175] });
            addSpace(3);
          });
        }

        if (summary.actionable_insights?.length) {
          addSpace(5);
          addText('Actionable Insights', { bold: true, size: 12 });
          addSpace(3);
          summary.actionable_insights.forEach((insight, i) => {
            addText(`${i + 1}. ${insight}`, { size: 10 });
          });
        }
      }

      doc.save(`transcript-${participant.email.split('@')[0]}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
    setExporting(null);
  };

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
            <h1 className="text-3xl font-semibold text-white">
              {participant.email}
            </h1>
            <p className="text-[#A1A1AA] text-sm mt-2">
              {interview?.title}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={
              participant.status === 'completed' ? 'success' :
              participant.status === 'incomplete' ? 'warning' : 'default'
            }>
              {participant.status === 'in_progress' ? 'In Progress' :
               participant.status === 'incomplete' ? 'Incomplete' : 'Completed'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Insights */}
          {summary && (
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const bullets = summary.free_form_insights
                    .split('\n')
                    .filter((line: string) => line.trim().startsWith('-'));

                  // Fallback: if no bullets found, render as paragraph (for old summaries)
                  if (bullets.length === 0) {
                    return (
                      <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">
                        {summary.free_form_insights}
                      </p>
                    );
                  }

                  return (
                    <ul className="space-y-2">
                      {bullets.map((bullet: string, i: number) => (
                        <li key={i} className="flex gap-2 text-sm text-white">
                          <span className="text-[#0D9373] flex-shrink-0">•</span>
                          <span>{bullet.trim().replace(/^-\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Transcript */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Transcript</CardTitle>
                  <CardDescription>
                    Full conversation history
                  </CardDescription>
                </div>
                {/* Export Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={exportAsTxt}
                    disabled={exporting !== null}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    {exporting === 'txt' ? '...' : 'TXT'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={exportAsDocx}
                    disabled={exporting !== null}
                  >
                    <FileIcon className="w-4 h-4 mr-1" />
                    {exporting === 'docx' ? '...' : 'DOCX'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={exportAsPdf}
                    disabled={exporting !== null}
                  >
                    <File className="w-4 h-4 mr-1" />
                    {exporting === 'pdf' ? '...' : 'PDF'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {transcript?.messages && transcript.messages.length > 0 ? (
                <div className="space-y-6">
                  {transcript.messages.map((message: Message, i: number) => (
                    <div key={message.id || i} className="flex gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-medium ${
                          message.role === 'agent'
                            ? 'bg-[#0D9373]/20 text-[#0D9373] border border-[#0D9373]/50'
                            : 'bg-[#18181B] text-[#A1A1AA] border border-[#27272A]'
                        }`}
                      >
                        {message.role === 'agent' ? 'AI' : 'P'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-medium ${
                            message.role === 'agent' ? 'text-[#0D9373]' : 'text-white'
                          }`}>
                            {message.role === 'agent' ? 'Census' : 'Participant'}
                          </span>
                        </div>
                        <p className="text-sm text-white leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#6B7280]">No messages recorded</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">Started</span>
                <span className="text-sm text-[var(--foreground)]">
                  {formatDate(participant.started_at)}
                </span>
              </div>
              {participant.completed_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted-foreground)]">Completed</span>
                  <span className="text-sm text-[var(--foreground)]">
                    {formatDate(participant.completed_at)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">Messages</span>
                <span className="text-sm text-[var(--foreground)]">
                  {transcript?.messages?.length || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Key Themes */}
          {summary?.key_themes && summary.key_themes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Key Themes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {summary.key_themes.map((theme: string, i: number) => (
                    <Badge key={i} variant="default">{theme}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sentiment */}
          {summary?.participant_sentiment && (
            <Card>
              <CardHeader>
                <CardTitle>Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--foreground)]">
                  {summary.participant_sentiment}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Notable Quotes */}
          {summary?.notable_quotes && summary.notable_quotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Notable Quotes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {summary.notable_quotes.map((quote: { text: string; context: string }, i: number) => (
                    <div key={i} className="border-l-2 border-emerald-500 pl-3">
                      <p className="text-sm font-serif text-[var(--foreground)] italic">
                        &ldquo;{quote.text}&rdquo;
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        {quote.context}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actionable Insights */}
          {summary?.actionable_insights && summary.actionable_insights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {summary.actionable_insights.map((insight: string, i: number) => (
                    <li key={i} className="flex gap-2 text-sm text-[var(--foreground)]">
                      <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
