import React, { useEffect, useState } from 'react';
import { getUserRides } from '../api/rideApi';
import { Ride } from '../types';
import RideCard from '../components/rides/RideCard';
import { toast } from 'react-toastify';

const MyRides: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRides = async () => {
      try {
        setIsLoading(true);
        const data = await getUserRides();
        setRides(data);
      } catch (err) {
        console.error('Error fetching rides:', err);
        setError('Failed to load your rides. Please try again later.');
        toast.error('Failed to load your rides');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRides();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Rides</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : rides.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rides yet</h3>
          <p className="text-gray-500">You haven't booked any rides yet. Book your first ride now!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rides.map((ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRides;