"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Room {
    id: number;
    name: string;
    price: string;
    image: string;
}

interface BookingModalProps {
    room: Room | null;
    isOpen: boolean;
    onClose: () => void;
}

export function BookingModal({ room, isOpen, onClose }: BookingModalProps) {
    const [step, setStep] = useState(1); // 1: Details, 2: Success
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Booking State
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [roomsCount, setRoomsCount] = useState(1);

    if (!isOpen || !room) return null;

    // Logic: Max 3 adults per room
    const handleAdultsChange = (newCount: number) => {
        if (newCount < 1) return;
        setAdults(newCount);

        // Auto-increase rooms if needed
        const requiredRooms = Math.ceil(newCount / 3);
        if (roomsCount < requiredRooms) {
            setRoomsCount(requiredRooms);
        }
    };

    const handleRoomsChange = (newCount: number) => {
        if (newCount < 1) return;

        // Prevent decreasing rooms if it violates the 3 adults/room rule
        const maxAdultsCapacity = newCount * 3;
        if (adults > maxAdultsCapacity) {
            // Option 1: Don't allow decrease (we'll stick with this for simplicity/UX)
            return;
        }
        setRoomsCount(newCount);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setStep(2);
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]">

                            {/* Header */}
                            <div className="relative h-32 bg-slate-900 shrink-0">
                                <Image
                                    src={room.image}
                                    alt={room.name}
                                    fill
                                    className="object-cover opacity-50"
                                />
                                <div className="absolute inset-0 flex items-end p-6">
                                    <div className="text-white">
                                        <h2 className="text-2xl font-serif font-bold leading-none mb-1">{room.name}</h2>
                                        <p className="text-orange-400 text-sm font-medium">{room.price} / night</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 overflow-y-auto">
                                {step === 1 ? (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Check In</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input required type="date" className="w-full pl-9 pr-4 py-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all border border-transparent focus:border-orange-200" />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Check Out</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input required type="date" className="w-full pl-9 pr-4 py-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all border border-transparent focus:border-orange-200" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Guest & Room Configuration */}
                                        <div className="bg-slate-50 rounded-xl p-4 space-y-4 border border-slate-100">
                                            {/* Adults */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900">Adults</span>
                                                    <span className="text-[10px] text-slate-500 font-medium tracking-wide">Max 3 per room</span>
                                                </div>
                                                <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm border border-slate-200 p-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAdultsChange(adults - 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-4 text-center text-sm font-bold text-slate-900">{adults}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAdultsChange(adults + 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Children */}
                                            <div className="flex items-center justify-between border-t border-slate-200/60 pt-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900">Children</span>
                                                    <span className="text-[10px] text-orange-600 font-medium tracking-wide">Under 5 years allowed</span>
                                                </div>
                                                <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm border border-slate-200 p-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setChildren(Math.max(0, children - 1))}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-4 text-center text-sm font-bold text-slate-900">{children}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setChildren(children + 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Rooms */}
                                            <div className="flex items-center justify-between border-t border-slate-200/60 pt-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900">Rooms</span>
                                                    <span className="text-[10px] text-slate-500 font-medium tracking-wide">Auto-adjusted based on adults</span>
                                                </div>
                                                <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm border border-slate-200 p-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRoomsChange(roomsCount - 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        disabled={roomsCount <= Math.ceil(adults / 3)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-4 text-center text-sm font-bold text-slate-900">{roomsCount}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRoomsChange(roomsCount + 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 pt-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                            <input required placeholder="Enter your full name" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all border border-transparent focus:border-orange-200 placeholder:text-slate-400" />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                                            <input required type="tel" placeholder="+91 98765 43210" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all border border-transparent focus:border-orange-200 placeholder:text-slate-400" />
                                        </div>

                                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-xs text-orange-800 space-y-1">
                                            <p className="font-bold">Important Requirements:</p>
                                            <ul className="list-disc list-inside space-y-0.5 ml-1">
                                                <li>Indian Nationals Only.</li>
                                                <li>Valid Govt ID required. <strong>PAN Card not accepted.</strong></li>
                                            </ul>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-14 mt-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-lg shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    Confirm Booking <ArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                ) : (
                                    <div className="py-8 text-center flex flex-col items-center animate-in fade-in zoom-in duration-300">
                                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-6">
                                            <CheckCircle className="w-10 h-10" />
                                        </div>
                                        <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
                                        <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                                            Thank you for choosing Shyam Heritage. We have sent a confirmation details to your phone.
                                        </p>
                                        <Button
                                            onClick={onClose}
                                            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
                                        >
                                            Done
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
