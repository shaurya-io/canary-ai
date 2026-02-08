import Link from 'next/link';
import { ArrowRight, MessageSquare, BarChart2, Clock, Sparkles, FileText, Shield, Check, Users, Brain, Mail, Zap, ChevronDown } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#09090B]">
      {/* Announcement Bar */}
      <div className="bg-[#0A0A0A] text-white py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm">
          <span className="text-[#A3A3A3]">Canary is backed by</span>
          <span className="font-semibold">Y Combinator</span>
          <span className="text-[#525252]">•</span>
          <span className="text-[#A3A3A3]">Anthropic</span>
          <Link href="#features" className="ml-4 text-[#F97316] font-medium inline-flex items-center gap-1 hover:underline">
            Learn more
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-10">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-[#09090B]">Canary</span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                <button className="px-4 py-2 text-[15px] font-medium text-[#09090B] hover:bg-[#F9FAFB] rounded-lg transition-colors inline-flex items-center gap-1">
                  Products
                  <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                </button>
                <Link href="#features" className="px-4 py-2 text-[15px] font-medium text-[#09090B] hover:bg-[#F9FAFB] rounded-lg transition-colors">
                  Features
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login" className="px-4 py-2 text-[15px] font-medium text-[#09090B] hover:bg-[#F9FAFB] rounded-lg transition-colors">
                Log in
              </Link>
              <Link
                href="/login"
                className="px-5 py-2.5 text-[15px] bg-[#F97316] text-white font-medium rounded-lg hover:bg-[#EA580C] transition-all shadow-sm"
              >
                Book a demo
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Two Column */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text */}
            <div>
              <Link
                href="#features"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded-full text-sm mb-8 hover:border-[#D1D5DB] transition-colors shadow-sm"
              >
                <span className="text-[#09090B] font-medium">Backed by</span>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-[#FF6600] text-white text-xs font-bold rounded">
                  Y
                </div>
                <span className="text-[#09090B] font-medium">Combinator</span>
              </Link>

              <h1 className="text-5xl sm:text-6xl font-bold tracking-[-0.02em] leading-[1.1] text-[#09090B]">
                AI-Native Interview Platform
              </h1>

              <p className="mt-6 text-xl text-[#6B7280] leading-relaxed max-w-xl">
                Start with AI agents for user research. Automate 80% of interview analysis. We'll set it up for you in 20 minutes.
              </p>

              {/* Email Input */}
              <div className="mt-10 max-w-md">
                <div className="flex items-center bg-white border border-[#E5E7EB] rounded-xl p-1.5 pl-4 shadow-sm">
                  <input
                    type="email"
                    placeholder="Enter your work email"
                    className="flex-1 py-2.5 bg-transparent text-[15px] text-[#09090B] placeholder:text-[#9CA3AF] focus:outline-none"
                  />
                  <Link
                    href="/login"
                    className="px-6 py-3 bg-[#F97316] text-white text-[15px] font-medium rounded-lg hover:bg-[#EA580C] transition-all whitespace-nowrap"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Demo Preview */}
            <div className="relative">
              {/* Response Time Card */}
              <div className="absolute -top-4 -left-4 bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-lg z-10">
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Response Time</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold text-[#09090B]">2 min</span>
                  <span className="text-sm font-medium text-[#22C55E]">↓ 85%</span>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-1">vs. 4hr industry avg</p>
              </div>

              {/* Main Demo Card */}
              <div className="border border-[#E5E7EB] bg-white rounded-2xl overflow-hidden shadow-xl">
                {/* Channel Tabs */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E5E7EB] bg-[#FAFAFA]">
                  <button className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#09090B] shadow-sm">
                    <Mail className="w-4 h-4 inline mr-1.5" />
                    Email
                  </button>
                  <button className="px-3 py-1.5 text-sm text-[#6B7280] hover:bg-white hover:border hover:border-[#E5E7EB] rounded-lg">
                    Surveys
                  </button>
                  <button className="px-3 py-1.5 text-sm text-[#6B7280] hover:bg-white hover:border hover:border-[#E5E7EB] rounded-lg">
                    Live
                  </button>
                </div>

                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-[#E5E7EB]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#09090B]">Interview Sessions</p>
                      <p className="text-sm text-[#6B7280]">Unified Inbox • 24 conversations</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4 space-y-4 bg-[#FAFAFA]">
                  {/* User Message */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F97316] to-[#FB923C] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                      SM
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#09090B]">Sarah Mitchell</span>
                        <span className="px-2 py-0.5 bg-[#FEF3C7] text-[#D97706] text-xs font-medium rounded-full">Beta User</span>
                        <span className="text-xs text-[#9CA3AF]">2 min ago</span>
                      </div>
                      <p className="mt-1 text-sm text-[#6B7280]">I'd love to share feedback on the new onboarding flow...</p>
                    </div>
                  </div>

                  {/* Another User */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                      MC
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#09090B]">Michael Chen</span>
                        <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#16A34A] text-xs font-medium rounded-full">Power User</span>
                        <span className="text-xs text-[#9CA3AF]">5 min ago</span>
                      </div>
                      <p className="mt-1 text-sm text-[#6B7280]">The new analytics dashboard is exactly what we needed!</p>
                    </div>
                  </div>
                </div>

                {/* AI Suggested Reply */}
                <div className="p-4 border-t border-[#E5E7EB] bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded bg-[#F97316] flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-[#F97316]">AI Suggested Reply</span>
                  </div>
                  <p className="text-sm text-[#6B7280] mb-3">
                    "Hi Sarah, thank you for reaching out! I'd love to hear your feedback on the onboarding flow. Would you like me to..."
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-[#F97316] text-white text-sm font-medium rounded-lg hover:bg-[#EA580C]">
                      Send
                    </button>
                    <button className="px-4 py-2 border border-[#E5E7EB] text-sm font-medium rounded-lg hover:bg-[#F9FAFB]">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Marquee */}
      <section className="py-12 px-6 border-y border-[#E5E7EB] bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-[#6B7280] mb-8">
            Integrates with your existing tools
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-6">
            <span className="text-xl font-semibold tracking-tight text-[#09090B]/40">Stripe</span>
            <span className="text-xl font-semibold tracking-tight text-[#09090B]/40">Notion</span>
            <span className="text-xl font-semibold tracking-tight text-[#09090B]/40">Linear</span>
            <span className="text-xl font-semibold tracking-tight text-[#09090B]/40">Vercel</span>
            <span className="text-xl font-semibold tracking-tight text-[#09090B]/40">Figma</span>
            <span className="text-xl font-semibold tracking-tight text-[#09090B]/40">Slack</span>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[13px] font-semibold text-[#F97316] tracking-wide uppercase mb-4">
              Replace Manual Research
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-[-0.02em] text-[#09090B]">
              User research and synthesis are eating your teams alive.
            </h2>
            <p className="mt-6 text-xl text-[#6B7280] max-w-2xl mx-auto">
              Stop switching between a dozen different tools. Canary brings interviews, analysis, and insights into a single AI-powered platform.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
              <p className="text-4xl font-bold text-[#09090B]">4+ hrs</p>
              <p className="text-sm text-[#6B7280] mt-2">Wasted daily</p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
              <p className="text-4xl font-bold text-[#09090B]">67%</p>
              <p className="text-sm text-[#6B7280] mt-2">Insights ignored</p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
              <p className="text-4xl font-bold text-[#09090B]">Weeks</p>
              <p className="text-sm text-[#6B7280] mt-2">Average research cycle</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 1 - Left Text, Right Visual */}
      <section id="features" className="py-24 px-6 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[13px] font-semibold text-[#F97316] tracking-wide uppercase mb-4">
                Intelligent Interviews
              </p>
              <h2 className="text-4xl font-bold tracking-[-0.02em] text-[#09090B]">
                Every interview. AI-guided.
              </h2>
              <p className="mt-6 text-lg text-[#6B7280] leading-relaxed">
                AI conducts adaptive interviews automatically. Personalized follow-ups in seconds—your team focuses on strategy, not scheduling.
              </p>

              <ul className="mt-8 space-y-4">
                <FeatureListItem>Smart follow-up questions based on responses</FeatureListItem>
                <FeatureListItem>AI drafts analysis and key themes</FeatureListItem>
                <FeatureListItem>24/7 availability in every language</FeatureListItem>
              </ul>

              <Link href="/login" className="mt-8 inline-flex items-center gap-2 text-[#F97316] font-medium hover:underline">
                Learn more
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Feature Demo Card */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#09090B]">Canary</p>
                    <div className="mt-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4">
                      <p className="text-sm text-[#374151]">
                        What specifically about the onboarding process felt confusing?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F97316] to-[#FB923C] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                    U
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#09090B]">User</p>
                    <div className="mt-2 bg-[#F97316] text-white rounded-xl p-4">
                      <p className="text-sm">
                        The setup wizard had too many steps and I kept losing my progress...
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reasoning Log */}
                <div className="bg-[#FFF7ED] border border-[#FDBA74] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-[#F97316]" />
                    <span className="text-sm font-medium text-[#F97316]">AI Analysis</span>
                  </div>
                  <p className="text-sm text-[#9A3412]">
                    Detected friction point: multi-step wizard causing drop-off. Following up on progress persistence...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2 - Right Text, Left Visual */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Review Card Demo */}
            <div className="order-2 lg:order-1">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-[#F97316]" />
                    <span className="font-semibold text-[#09090B]">Analysis</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-[#09090B]">4.7</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} className={`w-4 h-4 ${i <= 4 ? 'text-[#F97316]' : 'text-[#E5E7EB]'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                  <button className="px-3 py-1.5 bg-[#09090B] text-white text-sm font-medium rounded-lg">All</button>
                  <button className="px-3 py-1.5 text-sm text-[#6B7280] hover:bg-[#F9FAFB] rounded-lg">Positive</button>
                  <button className="px-3 py-1.5 text-sm text-[#6B7280] hover:bg-[#F9FAFB] rounded-lg">Neutral</button>
                  <button className="px-3 py-1.5 text-sm text-[#6B7280] hover:bg-[#F9FAFB] rounded-lg">Negative</button>
                </div>

                {/* Analysis Item */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-[#F9FAFB] rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                      JD
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[#09090B]">James Davidson</span>
                        <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#16A34A] text-xs font-medium rounded-full">Positive</span>
                        <span className="text-xs text-[#9CA3AF]">2h ago</span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <svg key={i} className="w-3.5 h-3.5 text-[#F97316]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-[#6B7280]">"The AI follow-up questions really helped me articulate my thoughts better!"</p>

                      {/* Draft Response */}
                      <div className="mt-3 p-3 bg-[#FFF7ED] border border-[#FDBA74] rounded-lg">
                        <div className="flex items-center gap-1 mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                          <span className="text-xs font-medium text-[#F97316]">Draft Response</span>
                        </div>
                        <p className="text-sm text-[#9A3412]">Thank you so much, James! We're thrilled the AI interview experience helped...</p>
                        <div className="flex gap-2 mt-2">
                          <button className="px-3 py-1 bg-[#F97316] text-white text-xs font-medium rounded-md">Publish</button>
                          <button className="px-3 py-1 border border-[#E5E7EB] text-xs font-medium rounded-md">Edit</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-[13px] font-semibold text-[#F97316] tracking-wide uppercase mb-4">
                Analysis Dashboard
              </p>
              <h2 className="text-4xl font-bold tracking-[-0.02em] text-[#09090B]">
                Every insight. Surfaced.
              </h2>
              <p className="mt-6 text-lg text-[#6B7280] leading-relaxed">
                Automatic synthesis of interview data. AI surfaces themes, sentiment, and actionable insights in real-time.
              </p>

              <ul className="mt-8 space-y-4">
                <FeatureListItem>All interviews in one dashboard</FeatureListItem>
                <FeatureListItem>AI writes comprehensive summaries</FeatureListItem>
                <FeatureListItem>Real-time sentiment analysis</FeatureListItem>
              </ul>

              <Link href="/login" className="mt-8 inline-flex items-center gap-2 text-[#F97316] font-medium hover:underline">
                Learn more
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Feature Grid Section */}
      <section className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-[-0.02em] text-white">
              AI Agents that never sleep
            </h2>
            <p className="mt-6 text-lg text-[#A3A3A3] max-w-2xl mx-auto">
              Think of them as digital researchers that handle the repetitive work—so your team can focus on building better products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DarkFeatureCard
              icon={<Mail className="w-5 h-5" />}
              title="Automated interviews"
              description="AI conducts and adapts interviews in your research style."
            />
            <DarkFeatureCard
              icon={<MessageSquare className="w-5 h-5" />}
              title="Real-time follow-ups"
              description="Instant, contextual follow-up questions based on responses."
            />
            <DarkFeatureCard
              icon={<BarChart2 className="w-5 h-5" />}
              title="Auto-synthesis"
              description="Themes and insights extracted automatically."
            />
            <DarkFeatureCard
              icon={<Zap className="w-5 h-5" />}
              title="Instant summaries"
              description="Comprehensive summaries generated after each interview."
            />
            <DarkFeatureCard
              icon={<Clock className="w-5 h-5" />}
              title="Always available"
              description="24/7 interview availability for global participants."
            />
            <DarkFeatureCard
              icon={<Users className="w-5 h-5" />}
              title="Smart routing"
              description="Complex topics automatically flagged for human review."
            />
          </div>
        </div>
      </section>

      {/* Setup Steps Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[13px] font-semibold text-[#F97316] tracking-wide uppercase mb-4">
              Live in minutes, not months
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-[-0.02em] text-[#09090B]">
              The fastest setup in research tools
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <SetupStep
              number="01"
              title="Define your goals"
              description="Tell Canary what you want to learn. AI generates tailored interview questions."
            />
            <SetupStep
              number="02"
              title="Share your link"
              description="Publish and share with participants. AI handles scheduling and reminders."
            />
            <SetupStep
              number="03"
              title="Get insights"
              description="Receive summaries, themes, and actionable insights automatically."
            />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 px-6 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <p className="text-[13px] font-semibold text-[#F97316] tracking-wide uppercase mb-4">
                For Security First Teams
              </p>
              <h2 className="text-4xl font-bold tracking-[-0.02em] text-[#09090B]">
                Scale securely with confidence
              </h2>
              <p className="mt-6 text-lg text-[#6B7280] leading-relaxed">
                Our AI platform is designed with enterprise-grade security practices and compliant with global data protection standards.
              </p>
              <Link
                href="/login"
                className="mt-8 inline-block px-6 py-3 bg-[#F97316] text-white font-medium rounded-lg hover:bg-[#EA580C] transition-all shadow-sm"
              >
                Start for free
              </Link>
            </div>

            <div className="flex items-center gap-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Shield className="w-12 h-12 text-[#D1D5DB]" />
                </div>
                <p className="text-sm font-medium text-[#6B7280]">CCPA</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Shield className="w-12 h-12 text-[#D1D5DB]" />
                </div>
                <p className="text-sm font-medium text-[#6B7280]">GDPR</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center border-2 border-[#D1D5DB] rounded-lg">
                  <span className="text-xs font-bold text-[#6B7280]">ISO<br/>27001</span>
                </div>
                <p className="text-sm font-medium text-[#6B7280]">ISO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark */}
      <section className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-[#171717] border border-[#262626] rounded-2xl p-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-white">
              Ready to transform your user research?
            </h2>
            <p className="mt-4 text-lg text-[#A3A3A3]">
              Schedule a demo and see how Canary can help your team get 3x more insights while saving hours.
            </p>

            <div className="mt-10 max-w-md mx-auto">
              <div className="flex items-center bg-[#262626] border border-[#404040] rounded-xl p-1.5 pl-4">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  className="flex-1 py-2.5 bg-transparent text-[15px] text-white placeholder:text-[#737373] focus:outline-none"
                />
                <Link
                  href="/login"
                  className="px-6 py-3 bg-[#F97316] text-white text-[15px] font-medium rounded-lg hover:bg-[#EA580C] transition-all whitespace-nowrap"
                >
                  Get started
                </Link>
              </div>
            </div>

            <p className="mt-4 text-sm text-[#525252]">
              By clicking "Get started", you agree to the use of your data in accordance with Canary's{' '}
              <Link href="#" className="text-[#A3A3A3] underline">Privacy Notice</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-white border-t border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-[#09090B]">Canary</span>
              </div>

              <div className="max-w-xs">
                <div className="flex items-center bg-white border border-[#E5E7EB] rounded-lg p-1 pl-3 mb-4">
                  <input
                    type="email"
                    placeholder="Enter your work email"
                    className="flex-1 py-1.5 bg-transparent text-sm text-[#09090B] placeholder:text-[#9CA3AF] focus:outline-none"
                  />
                  <button className="px-3 py-1.5 bg-[#F97316] text-white text-sm font-medium rounded-md hover:bg-[#EA580C]">
                    Subscribe
                  </button>
                </div>
                <Link href="mailto:hello@canary.ai" className="text-sm text-[#6B7280] hover:text-[#F97316]">
                  hello@canary.ai
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-[#09090B] mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="#features" className="text-sm text-[#6B7280] hover:text-[#09090B]">Features</Link></li>
                <li><Link href="#" className="text-sm text-[#6B7280] hover:text-[#09090B]">Pricing</Link></li>
                <li><Link href="#" className="text-sm text-[#6B7280] hover:text-[#09090B]">Integrations</Link></li>
                <li><Link href="#" className="text-sm text-[#6B7280] hover:text-[#09090B]">Changelog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#09090B] mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-sm text-[#6B7280] hover:text-[#09090B]">Documentation</Link></li>
                <li><Link href="#" className="text-sm text-[#6B7280] hover:text-[#09090B]">Blog</Link></li>
                <li><Link href="#" className="text-sm text-[#6B7280] hover:text-[#09090B]">Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#09090B] mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-sm text-[#6B7280] hover:text-[#09090B]">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm text-[#6B7280] hover:text-[#09090B]">Terms of Service</Link></li>
                <li><Link href="#" className="text-sm text-[#6B7280] hover:text-[#09090B]">Trust Center</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E5E7EB] flex items-center justify-between">
            <span className="text-sm text-[#6B7280]">
              &copy; {new Date().getFullYear()} Canary. All rights reserved.
            </span>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-[#6B7280] hover:text-[#09090B]">
                <span className="text-lg">𝕏</span>
              </Link>
              <Link href="#" className="text-[#6B7280] hover:text-[#09090B]">
                <span className="text-lg font-bold">in</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-[#FFF7ED] flex items-center justify-center flex-shrink-0">
        <Check className="w-3 h-3 text-[#F97316]" />
      </div>
      <span className="text-[#374151]">{children}</span>
    </li>
  );
}

function DarkFeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-[#171717] border border-[#262626] p-6 rounded-xl hover:border-[#404040] transition-all">
      <div className="w-12 h-12 rounded-xl bg-[#F97316]/15 flex items-center justify-center text-[#F97316] mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-[#A3A3A3] text-[15px] leading-relaxed">{description}</p>
    </div>
  );
}

function SetupStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <span className="text-sm font-semibold text-[#9CA3AF]">{number}</span>
      <h3 className="text-xl font-semibold text-[#09090B] mt-2 mb-3">{title}</h3>
      <p className="text-[#6B7280] text-[15px] leading-relaxed">{description}</p>
    </div>
  );
}
