'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { formatTimeSlot } from '@/lib/utils';
import type { User, Interview } from '@/types';

export default function AdminDashboard() {
    const [candidates, setCandidates] = useState<User[]>([]);
    const [interviewers, setInterviewers] = useState<User[]>([]);
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [selectedInterviewer, setSelectedInterviewer] = useState('');
    const [duration, setDuration] = useState(60);
    const [interviewType, setInterviewType] = useState('technical');
    const [loading, setLoading] = useState(false);
    const [matchedInterview, setMatchedInterview] = useState<Interview | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [meetingLink, setMeetingLink] = useState('');
    const [location, setLocation] = useState('Virtual');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const candidatesRes = await api.getUsersByRole('candidate');
            const interviewersRes = await api.getUsersByRole('interviewer');

            if (candidatesRes.success && candidatesRes.data) {
                setCandidates(candidatesRes.data.users);
            }
            if (interviewersRes.success && interviewersRes.data) {
                setInterviewers(interviewersRes.data.users);
            }
        } catch (err) {
            console.error('Error loading users:', err);
        }
    };

    const handleMatch = async () => {
        if (!selectedCandidate || !selectedInterviewer) {
            setError('Please select both candidate and interviewer');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');
        setMatchedInterview(null);

        try {
            const response = await api.matchInterviewSlots({
                candidateId: selectedCandidate,
                interviewerId: selectedInterviewer,
                duration,
                interviewType,
            });

            if (response.success && response.data) {
                setMatchedInterview(response.data.interview);
                setSuccess('Successfully found matching time slots!');
            } else {
                setError(response.error?.message || 'Failed to find matching slots');
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (slotIndex: number) => {
        if (!matchedInterview) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await api.confirmInterview({
                interviewId: matchedInterview._id,
                selectedSlotIndex: slotIndex,
                meetingLink: meetingLink || undefined,
                location: location || undefined,
            });

            if (response.success) {
                setSuccess('Interview confirmed! Emails sent to both parties.');
                setMatchedInterview(null);
                setSelectedCandidate('');
                setSelectedInterviewer('');
                setMeetingLink('');
            } else {
                setError(response.error?.message || 'Failed to confirm interview');
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="glass border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
                                <p className="text-xs text-[var(--text-muted)]">Interview Matching</p>
                            </div>
                        </Link>
                        <nav className="flex items-center gap-4">
                            <Link href="/" className="btn-secondary btn text-sm">
                                ← Back to Home
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h2 className="text-4xl font-bold mb-3 text-white">Match Interviews</h2>
                    <p className="text-white/80">Select a candidate and interviewer to find matching time slots</p>
                </div>

                {success && (
                    <div className="success animate-fade-in">
                        ✓ {success}
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 animate-fade-in">
                        {error}
                    </div>
                )}

                {/* Matching Form */}
                <div className="card mb-8">
                    <h3 className="text-2xl font-bold mb-6 text-white">Select Participants</h3>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="label">Candidate *</label>
                            <select
                                value={selectedCandidate}
                                onChange={(e) => setSelectedCandidate(e.target.value)}
                                className="input"
                            >
                                <option value="">Select a candidate</option>
                                {candidates.map((candidate) => (
                                    <option key={candidate._id} value={candidate._id}>
                                        {candidate.name} ({candidate.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">Interviewer *</label>
                            <select
                                value={selectedInterviewer}
                                onChange={(e) => setSelectedInterviewer(e.target.value)}
                                className="input"
                            >
                                <option value="">Select an interviewer</option>
                                {interviewers.map((interviewer) => (
                                    <option key={interviewer._id} value={interviewer._id}>
                                        {interviewer.name} ({interviewer.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">Duration (minutes)</label>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(parseInt(e.target.value))}
                                className="input"
                                min="15"
                                max="240"
                            />
                        </div>

                        <div>
                            <label className="label">Interview Type</label>
                            <select
                                value={interviewType}
                                onChange={(e) => setInterviewType(e.target.value)}
                                className="input"
                            >
                                <option value="technical">Technical</option>
                                <option value="behavioral">Behavioral</option>
                                <option value="hr">HR</option>
                                <option value="cultural-fit">Cultural Fit</option>
                                <option value="final">Final Round</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleMatch}
                        disabled={loading || !selectedCandidate || !selectedInterviewer}
                        className="btn-primary btn w-full"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <div className="spinner mr-2"></div>
                                Finding Matches...
                            </span>
                        ) : (
                            'Find Matching Time Slots'
                        )}
                    </button>
                </div>

                {/* Matched Slots */}
                {matchedInterview && matchedInterview.proposedSlots && matchedInterview.proposedSlots.length > 0 && (
                    <div className="card animate-fade-in">
                        <h3 className="text-2xl font-bold mb-6 text-white">
                            Proposed Time Slots ({matchedInterview.proposedSlots.length} options)
                        </h3>

                        <div className="space-y-4 mb-6">
                            {matchedInterview.proposedSlots.map((slot, index) => (
                                <div key={index} className="p-6 bg-black/20 rounded-lg border border-white/10 hover:border-[var(--primary)] transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white text-sm font-semibold">
                                                    Option {index + 1}
                                                </span>
                                                {slot.score && (
                                                    <span className="text-sm text-white/60">
                                                        Score: {slot.score.toFixed(1)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-lg text-white font-semibold">
                                                {formatTimeSlot(slot.start, slot.end)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleConfirm(index)}
                                            disabled={loading}
                                            className="btn-primary btn"
                                        >
                                            Confirm This Slot
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                            <div>
                                <label className="label">Meeting Link (Optional)</label>
                                <input
                                    type="url"
                                    value={meetingLink}
                                    onChange={(e) => setMeetingLink(e.target.value)}
                                    className="input"
                                    placeholder="https://meet.google.com/abc-defg-hij"
                                />
                            </div>

                            <div>
                                <label className="label">Location</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="input"
                                    placeholder="Virtual, Office, etc."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {matchedInterview && matchedInterview.proposedSlots && matchedInterview.proposedSlots.length === 0 && (
                    <div className="card text-center py-12 animate-fade-in">
                        <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white">No Matching Slots Found</h3>
                        <p className="text-white/60">
                            The candidate and interviewer don't have any overlapping availability.
                            Please ask them to update their schedules.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
