'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toDateTimeLocal } from '@/lib/utils';
import type { TimeSlot } from '@/types';

interface FormData {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    position?: string;
    inputMethod: 'structured' | 'freetext';
    rawText?: string;
    timeSlots?: TimeSlot[];
    validUntil: string;
    notes?: string;
}

export default function CandidatePage() {
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            inputMethod: 'structured',
            validUntil: toDateTimeLocal(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days from now
        },
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

    const inputMethod = watch('inputMethod');

    const addTimeSlot = () => {
        setTimeSlots([...timeSlots, { start: '', end: '' }]);
    };

    const removeTimeSlot = (index: number) => {
        setTimeSlots(timeSlots.filter((_, i) => i !== index));
    };

    const updateTimeSlot = (index: number, field: 'start' | 'end', value: string) => {
        const updated = [...timeSlots];
        updated[index] = { ...updated[index], [field]: value };
        setTimeSlots(updated);
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            // Create user first
            const userResponse = await api.createUser({
                name: data.name,
                email: data.email,
                role: 'candidate',
                phone: data.phone,
                company: data.company,
                position: data.position,
            });

            if (!userResponse.success || !userResponse.data) {
                throw new Error(userResponse.error?.message || 'Failed to create user');
            }

            const userId = userResponse.data.user._id;

            // Submit availability
            const availabilityData: any = {
                userId,
                validUntil: data.validUntil,
                notes: data.notes,
            };

            if (data.inputMethod === 'freetext') {
                availabilityData.rawText = data.rawText;
            } else {
                availabilityData.timeSlots = timeSlots;
            }

            const availResponse = await api.submitAvailability(availabilityData);

            if (!availResponse.success) {
                throw new Error(availResponse.error?.message || 'Failed to submit availability');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

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

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-8 animate-fade-in">
                    <h2 className="text-4xl font-bold mb-3">Candidate Availability</h2>
                    <p className="text-[var(--text-muted)] text-lg">
                        Submit your availability for interviews. You can use natural language or select specific time slots.
                    </p>
                </div>

                {success && (
                    <div className="success animate-fade-in">
                        ✓ Availability submitted successfully! Redirecting to dashboard...
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 animate-fade-in">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="card animate-fade-in">
                    {/* Personal Information */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-semibold mb-6 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-sm mr-3">1</span>
                            Personal Information
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Full Name *</label>
                                <input
                                    {...register('name', { required: 'Name is required' })}
                                    className="input"
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="error">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="label">Email *</label>
                                <input
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    type="email"
                                    className="input"
                                    placeholder="john@example.com"
                                />
                                {errors.email && <p className="error">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="label">Phone</label>
                                <input
                                    {...register('phone')}
                                    className="input"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>

                            <div>
                                <label className="label">Company</label>
                                <input
                                    {...register('company')}
                                    className="input"
                                    placeholder="Acme Inc."
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="label">Position Applying For</label>
                                <input
                                    {...register('position')}
                                    className="input"
                                    placeholder="Senior Software Engineer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Availability Input Method */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-semibold mb-6 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-sm mr-3">2</span>
                            Availability
                        </h3>

                        <div className="mb-6">
                            <label className="label">How would you like to submit your availability?</label>
                            <div className="grid md:grid-cols-2 gap-4">
                                <label className={`card cursor-pointer ${inputMethod === 'structured' ? 'border-[var(--primary)]' : ''}`}>
                                    <input
                                        {...register('inputMethod')}
                                        type="radio"
                                        value="structured"
                                        className="sr-only"
                                    />
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mr-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${inputMethod === 'structured' ? 'border-[var(--primary)]' : 'border-gray-500'}`}>
                                                {inputMethod === 'structured' && <div className="w-3 h-3 rounded-full bg-[var(--primary)]"></div>}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1">Structured Time Slots</h4>
                                            <p className="text-sm text-[var(--text-muted)]">Select specific dates and times</p>
                                        </div>
                                    </div>
                                </label>

                                <label className={`card cursor-pointer ${inputMethod === 'freetext' ? 'border-[var(--primary)]' : ''}`}>
                                    <input
                                        {...register('inputMethod')}
                                        type="radio"
                                        value="freetext"
                                        className="sr-only"
                                    />
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mr-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${inputMethod === 'freetext' ? 'border-[var(--primary)]' : 'border-gray-500'}`}>
                                                {inputMethod === 'freetext' && <div className="w-3 h-3 rounded-full bg-[var(--primary)]"></div>}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1">Natural Language (AI)</h4>
                                            <p className="text-sm text-[var(--text-muted)]">Write in plain English</p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {inputMethod === 'freetext' ? (
                            <div>
                                <label className="label">Describe your availability *</label>
                                <textarea
                                    {...register('rawText', { required: inputMethod === 'freetext' ? 'Please describe your availability' : false })}
                                    className="input min-h-[150px]"
                                    placeholder="Example: I'm available Monday through Friday from 2pm to 5pm, and next Tuesday morning from 9am to 12pm"
                                />
                                {errors.rawText && <p className="error">{errors.rawText.message}</p>}
                                <p className="text-sm text-[var(--text-muted)] mt-2">
                                    💡 Our AI will parse your availability and convert it to time slots
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="label mb-0">Time Slots *</label>
                                    <button
                                        type="button"
                                        onClick={addTimeSlot}
                                        className="btn-secondary btn text-sm"
                                    >
                                        + Add Time Slot
                                    </button>
                                </div>

                                {timeSlots.length === 0 && (
                                    <p className="text-[var(--text-muted)] text-center py-8">
                                        No time slots added yet. Click "Add Time Slot" to get started.
                                    </p>
                                )}

                                <div className="space-y-4">
                                    {timeSlots.map((slot, index) => (
                                        <div key={index} className="flex items-start space-x-4 p-4 bg-black/20 rounded-lg">
                                            <div className="flex-1 grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="label text-sm">Start Time</label>
                                                    <input
                                                        type="datetime-local"
                                                        value={slot.start}
                                                        onChange={(e) => updateTimeSlot(index, 'start', e.target.value)}
                                                        className="input"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="label text-sm">End Time</label>
                                                    <input
                                                        type="datetime-local"
                                                        value={slot.end}
                                                        onChange={(e) => updateTimeSlot(index, 'end', e.target.value)}
                                                        className="input"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeTimeSlot(index)}
                                                className="mt-8 text-red-500 hover:text-red-400"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-6">
                            <label className="label">Valid Until *</label>
                            <input
                                {...register('validUntil', { required: 'Valid until date is required' })}
                                type="datetime-local"
                                className="input"
                            />
                            {errors.validUntil && <p className="error">{errors.validUntil.message}</p>}
                            <p className="text-sm text-[var(--text-muted)] mt-2">
                                How long is this availability valid?
                            </p>
                        </div>

                        <div className="mt-6">
                            <label className="label">Additional Notes</label>
                            <textarea
                                {...register('notes')}
                                className="input min-h-[100px]"
                                placeholder="Any preferences or special requirements..."
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <Link href="/" className="btn-secondary btn">
                            ← Back
                        </Link>
                        <button
                            type="submit"
                            disabled={loading || (inputMethod === 'structured' && timeSlots.length === 0)}
                            className="btn-primary btn"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <div className="spinner mr-2 w-5 h-5 border-2"></div>
                                    Submitting...
                                </span>
                            ) : (
                                'Submit Availability'
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
