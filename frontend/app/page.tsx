'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="glass border-b sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Interview Scheduler</h1>
                <p className="text-xs text-[var(--text-muted)]">AI-Powered Matching</p>
              </div>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/dashboard" className="btn-primary btn text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-16 relative">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[var(--primary)]/20 to-[var(--secondary)]/20 border border-[var(--primary)]/30 text-sm font-semibold text-[var(--primary)]">
                ✨ Powered by OpenAI GPT-4
              </span>
            </div>
            <h2 className="text-6xl font-bold mb-6 leading-tight">
              Smart Interview Scheduling
              <br />
              <span className="gradient-text">Made Simple</span>
            </h2>
            <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed mb-8">
              Automatically match interviewer and candidate availability using intelligent AI algorithms.
              Submit your schedule in natural language or structured time slots.
            </p>

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">AI-Powered</div>
                <div className="text-sm text-[var(--text-muted)]">Natural Language</div>
              </div>
              <div className="w-px h-12 bg-[var(--border)]"></div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">Smart</div>
                <div className="text-sm text-[var(--text-muted)]">Matching Algorithm</div>
              </div>
              <div className="w-px h-12 bg-[var(--border)]"></div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">Instant</div>
                <div className="text-sm text-[var(--text-muted)]">Calendar Invites</div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Candidate Card */}
            <Link href="/candidate">
              <div
                className={`card cursor-pointer transition-all duration-300 relative overflow-hidden group ${hoveredCard === 'candidate' ? 'scale-105' : ''
                  }`}
                onMouseEnter={() => setHoveredCard('candidate')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                      <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    I'm a Candidate
                  </h3>

                  <p className="text-[var(--text-muted)] mb-6 leading-relaxed">
                    Submit your availability for interviews. Use natural language like "I'm free Monday 2-4pm" or select specific time slots.
                  </p>

                  <div className="flex items-center text-blue-500 font-semibold group-hover:translate-x-2 transition-transform">
                    <span>Get Started</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Interviewer Card */}
            <Link href="/interviewer">
              <div
                className={`card cursor-pointer transition-all duration-300 relative overflow-hidden group ${hoveredCard === 'interviewer' ? 'scale-105' : ''
                  }`}
                onMouseEnter={() => setHoveredCard('interviewer')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                      <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    I'm an Interviewer
                  </h3>

                  <p className="text-[var(--text-muted)] mb-6 leading-relaxed">
                    Share your available time slots. Our AI will find the best matches with candidates and propose optimal interview times.
                  </p>

                  <div className="flex items-center text-purple-500 font-semibold group-hover:translate-x-2 transition-transform">
                    <span>Get Started</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Features List */}
          <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
            <div className="text-center group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3">AI-Powered Parsing</h4>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Write availability in plain English and let AI convert it to structured time slots automatically
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3">Smart Matching</h4>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Intelligent algorithm finds optimal time slots based on business hours and preferences
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3">Calendar Invites</h4>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Automatic email notifications with .ics calendar files for seamless integration
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 relative">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-[var(--text-muted)] mb-2">
            © 2026 Interview Scheduler. Built with Next.js, Express, and OpenAI.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Intelligent scheduling made simple
          </p>
        </div>
      </footer>
    </div>
  );
}
