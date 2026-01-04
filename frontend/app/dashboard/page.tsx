'use client';

import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="min-h-screen">
            <header className="glass border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold gradient-text">Interview Scheduler</h1>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-8 animate-fade-in">
                    <h2 className="text-4xl font-bold mb-3">Dashboard</h2>
                    <p className="text-[var(--text-muted)] text-lg">
                        View your scheduled interviews and availability
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Pending Interviews</h3>
                            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-sm text-[var(--text-muted)] mt-2">Awaiting confirmation</p>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Confirmed</h3>
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-sm text-[var(--text-muted)] mt-2">Scheduled interviews</p>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Completed</h3>
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-sm text-[var(--text-muted)] mt-2">Past interviews</p>
                    </div>
                </div>

                <div className="card animate-fade-in">
                    <div className="text-center py-12">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Welcome to Interview Scheduler!</h3>
                        <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto">
                            Your availability has been submitted successfully. Interviews will appear here once matches are found.
                        </p>
                        <div className="flex items-center justify-center space-x-4">
                            <Link href="/candidate" className="btn-secondary btn">
                                Submit as Candidate
                            </Link>
                            <Link href="/interviewer" className="btn-primary btn">
                                Submit as Interviewer
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
