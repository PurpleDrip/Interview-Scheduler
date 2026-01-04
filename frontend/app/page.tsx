'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold gradient-text">Interview Scheduler</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/dashboard" className="btn-secondary btn text-sm">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl font-bold mb-6">
              Smart Interview Scheduling
              <br />
              <span className="gradient-text">Powered by AI</span>
            </h2>
            <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto">
              Automatically match interviewer and candidate availability using intelligent algorithms.
              Submit your schedule in natural language or structured time slots.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Candidate Card */}
            <Link href="/candidate">
              <div
                className={`card cursor-pointer transition-all duration-300 ${hoveredCard === 'candidate' ? 'scale-105' : ''
                  }`}
                onMouseEnter={() => setHoveredCard('candidate')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">I'm a Candidate</h3>
                    <p className="text-[var(--text-muted)] mb-4">
                      Submit your availability for interviews. Use natural language like "I'm free Monday 2-4pm" or select specific time slots.
                    </p>
                    <div className="flex items-center text-[var(--primary)] font-semibold">
                      <span>Submit Availability</span>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Interviewer Card */}
            <Link href="/interviewer">
              <div
                className={`card cursor-pointer transition-all duration-300 ${hoveredCard === 'interviewer' ? 'scale-105' : ''
                  }`}
                onMouseEnter={() => setHoveredCard('interviewer')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">I'm an Interviewer</h3>
                    <p className="text-[var(--text-muted)] mb-4">
                      Share your available time slots. Our AI will find the best matches with candidates and propose optimal interview times.
                    </p>
                    <div className="flex items-center text-[var(--primary)] font-semibold">
                      <span>Submit Availability</span>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Features List */}
          <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">AI-Powered Parsing</h4>
              <p className="text-sm text-[var(--text-muted)]">
                Write availability in plain English and let AI convert it to time slots
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">Smart Matching</h4>
              <p className="text-sm text-[var(--text-muted)]">
                Intelligent algorithm finds optimal time slots based on preferences
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">Calendar Invites</h4>
              <p className="text-sm text-[var(--text-muted)]">
                Automatic email notifications with .ics calendar files
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[var(--text-muted)]">
          <p>© 2026 Interview Scheduler. Built with Next.js, Express, and OpenAI.</p>
        </div>
      </footer>
    </div>
  );
}
