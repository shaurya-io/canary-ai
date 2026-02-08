// Force dynamic rendering for interview pages
export const dynamic = 'force-dynamic';

export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
