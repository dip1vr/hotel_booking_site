"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wifi, Tv, Coffee, Maximize2, Star, Wind, Utensils } from "lucide-react";
import dynamic from "next/dynamic";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const BookingBar = dynamic(() => import("./BookingBar").then((mod) => mod.BookingBar));
const RoomDetailsModal = dynamic(() => import("./RoomDetailsModal").then((mod) => mod.RoomDetailsModal));
const BookingModal = dynamic(() => import("./BookingModal").then((mod) => mod.BookingModal));
import { RoomImageCarousel } from "./RoomImageCarousel";

// Define the Room interface to match what's expected by the UI and Modals
interface Room {
    id: string | number;
    name: string;
    price: string;
    image: string;
    images?: string[];
    description: string;
    size: string;
    amenities: { icon: any; label: string }[];
}

// Helper to map amenity strings to icons
const getAmenityIcon = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes("wifi")) return Wifi;
    if (lowerLabel.includes("tv")) return Tv;
    if (lowerLabel.includes("bar") || lowerLabel.includes("coffee")) return Coffee;
    if (lowerLabel.includes("ac") || lowerLabel.includes("air")) return Wind;
    if (lowerLabel.includes("dining") || lowerLabel.includes("food")) return Utensils;
    return Star; // Default icon
};

export function RoomsSection() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [bookingRoom, setBookingRoom] = useState<Room | null>(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "rooms"));
                const fetchedRooms: Room[] = querySnapshot.docs.map((doc) => {
                    const data = doc.data();

                    // Format price if it's just a number string
                    let formattedPrice = data.price;
                    if (!formattedPrice.toString().startsWith("₹")) {
                        formattedPrice = `₹${data.price}`;
                    }

                    // Format size
                    let formattedSize = data.size;
                    if (formattedSize && !formattedSize.toString().toLowerCase().includes("sq ft")) {
                        formattedSize = `${formattedSize} sq ft`;
                    }

                    // Map amenities
                    const amenities = (Array.isArray(data.amenities) ? data.amenities : []).map((amenity: string) => ({
                        icon: getAmenityIcon(amenity),
                        label: amenity
                    }));

                    const imageArray = (Array.isArray(data.images) && data.images.length > 0)
                        ? data.images
                        : (data.image ? [data.image] : []);

                    return {
                        id: doc.id,
                        name: data.name,
                        price: formattedPrice,
                        image: data.image || imageArray[0] || "",
                        images: imageArray,
                        description: data.description,
                        size: formattedSize,
                        amenities: amenities
                    };
                });
                setRooms(fetchedRooms);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const handleBookNow = (room: Room) => {
        setBookingRoom(room);
        setSelectedRoom(null);
    };

    if (loading) {
        return (
            <section id="rooms" className="pb-24 bg-slate-50 relative min-h-[500px] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-64 bg-slate-200 rounded mb-4"></div>
                    <div className="h-4 w-48 bg-slate-200 rounded"></div>
                </div>
            </section>
        );
    }

    return (
        <section id="rooms" className="pb-24 bg-slate-50 relative">
            <div className="container mx-auto px-4">

                {/* Booking Bar (Floating overlap) */}
                <div id="booking-bar">
                    <BookingBar />
                </div>

                <div className="text-center max-w-2xl mx-auto mb-16 pt-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-serif text-4xl md:text-5xl font-bold mb-4 text-slate-900"
                    >
                        Luxury Accommodations
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-600 text-lg"
                    >
                        Experience the perfect blend of traditional heritage and modern comfort
                    </motion.p>
                </div>

                {rooms.length === 0 ? (
                    <div className="text-center text-slate-500 py-12">
                        No rooms available at the moment.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rooms.map((room, index) => (
                            <motion.div
                                key={room.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col border border-slate-100"
                            >
                                {/* Image Carousel */}
                                <div className="relative h-72">
                                    <RoomImageCarousel
                                        images={room.images || [room.image]}
                                        name={room.name}
                                        className="h-full"
                                        onClick={() => setSelectedRoom(room)}
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1 pointer-events-none z-10">
                                        <Maximize2 className="w-3 h-3" /> {room.size}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-serif text-2xl font-bold text-slate-900 mb-1">{room.name}</h3>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-bold text-orange-600">{room.price}</span>
                                                <span className="text-sm text-slate-400">/ night</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2">
                                        {room.description}
                                    </p>

                                    {/* Divider */}
                                    <div className="w-12 h-1 bg-orange-100 mb-6" />

                                    <div className="flex gap-4 mb-8">
                                        {room.amenities.slice(0, 3).map((item, i) => (
                                            <div key={i} className="flex items-center gap-1.5 text-slate-500">
                                                <item.icon className="w-4 h-4" />
                                                <span className="text-xs font-medium">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-auto grid grid-cols-2 gap-3">
                                        <Button
                                            variant="outline"
                                            className="w-full border-slate-200 hover:bg-slate-50 text-slate-900"
                                            onClick={() => setSelectedRoom(room)}
                                        >
                                            Details
                                        </Button>
                                        <Button
                                            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                                            onClick={() => handleBookNow(room)}
                                        >
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Room Details Modal */}
            <RoomDetailsModal
                room={selectedRoom}
                onClose={() => setSelectedRoom(null)}
                // In details modal, booking passes the currently viewed room
                onBook={() => selectedRoom && handleBookNow(selectedRoom)}
            />

            {/* Booking Wizard Modal */}
            <BookingModal
                room={bookingRoom}
                isOpen={!!bookingRoom}
                onClose={() => setBookingRoom(null)}
            />
        </section>
    );
}
