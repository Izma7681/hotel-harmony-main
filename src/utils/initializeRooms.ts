import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import { db } from '@/config/firebase';

export async function initializeRooms() {
  try {
    // Check if rooms already exist
    const roomsSnapshot = await getDocs(collection(db, 'rooms'));
    if (roomsSnapshot.size > 0) {
      console.log('Rooms already initialized');
      return { success: true, message: 'Rooms already exist' };
    }

    // Create 17 rooms (Room 1 to Room 17)
    const rooms = [];
    for (let i = 1; i <= 17; i++) {
      rooms.push({
        roomNumber: i.toString(),
        type: i <= 10 ? 'single' : 'double', // First 10 are single, rest are double
        price: i <= 10 ? 1000 : 1500, // Single: ₹1000, Double: ₹1500
        status: 'available',
        floor: Math.ceil(i / 6), // 6 rooms per floor
        amenities: ['WiFi', 'TV', 'AC', 'Bathroom'],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Add all rooms to Firestore
    for (const room of rooms) {
      await addDoc(collection(db, 'rooms'), room);
    }

    console.log('Successfully initialized 17 rooms');
    return { success: true, message: 'Successfully initialized 17 rooms' };
  } catch (error) {
    console.error('Error initializing rooms:', error);
    return { success: false, message: 'Failed to initialize rooms', error };
  }
}
