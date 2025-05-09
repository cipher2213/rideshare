import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Car } from 'lucide-react';
import { Location, RouteData } from '../types';
import { geocodeAddress, getRoute } from '../api/mapApi';
import { bookRide } from '../api/rideApi';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import MapView from '../components/map/MapView';
import { toast } from 'react-toastify';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [pickupValue, setPickupValue] = useState('');
  const [dropoffValue, setDropoffValue] = useState('');
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [route, setRoute] = useState<Location[] | null>(null);
  
  // When both pickup and dropoff locations are available, get the route
  useEffect(() => {
    const fetchRoute = async () => {
      if (pickupLocation && dropoffLocation) {
        try {
          const routeData = await getRoute(pickupLocation, dropoffLocation);
          setRoute(routeData);
        } catch (error) {
          console.error('Error getting route:', error);
          toast.error('Could not calculate route');
        }
      }
    };
    
    fetchRoute();
  }, [pickupLocation, dropoffLocation]);
  
  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickupValue(e.target.value);
    // Clear location when input changes
    setPickupLocation(null);
    setRoute(null);
  };
  
  const handleDropoffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDropoffValue(e.target.value);
    // Clear location when input changes
    setDropoffLocation(null);
    setRoute(null);
  };
  
  const handlePickupSearch = async () => {
    if (!pickupValue.trim()) return;
    
    try {
      setIsLoading(true);
      const location = await geocodeAddress(pickupValue);
      setPickupLocation(location);
    } catch (error) {
      console.error('Error geocoding pickup:', error);
      toast.error('Could not find pickup location');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDropoffSearch = async () => {
    if (!dropoffValue.trim()) return;
    
    try {
      setIsLoading(true);
      const location = await geocodeAddress(dropoffValue);
      setDropoffLocation(location);
    } catch (error) {
      console.error('Error geocoding dropoff:', error);
      toast.error('Could not find dropoff location');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBookRide = async () => {
    if (!pickupValue || !dropoffValue) {
      toast.error('Please enter pickup and dropoff locations');
      return;
    }
    
    try {
      setIsLoading(true);
      await bookRide({
        pickupLocation: pickupValue,
        dropLocation: dropoffValue
      });
      
      toast.success('Ride booked successfully!');
      navigate('/my-rides');
    } catch (error) {
      console.error('Error booking ride:', error);
      toast.error('Failed to book ride');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - Input Form */}
        <div className="md:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book a Ride</h2>
            
            <div className="space-y-4">
              {/* Pickup Location */}
              <div className="space-y-2">
                <label htmlFor="pickup" className="block text-sm font-medium text-gray-700">
                  Pickup Location
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="pickup"
                    value={pickupValue}
                    onChange={handlePickupChange}
                    placeholder="Enter pickup location"
                    fullWidth
                  />
                  <Button
                    variant="outline"
                    onClick={handlePickupSearch}
                    disabled={isLoading || !pickupValue.trim()}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Dropoff Location */}
              <div className="space-y-2">
                <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700">
                  Dropoff Location
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="dropoff"
                    value={dropoffValue}
                    onChange={handleDropoffChange}
                    placeholder="Enter dropoff location"
                    fullWidth
                  />
                  <Button
                    variant="outline"
                    onClick={handleDropoffSearch}
                    disabled={isLoading || !dropoffValue.trim()}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Book Ride Button */}
              <div className="pt-4">
                <Button
                  onClick={handleBookRide}
                  isLoading={isLoading}
                  disabled={!pickupLocation || !dropoffLocation}
                  fullWidth
                >
                  <Car className="mr-2 h-4 w-4" />
                  Book Ride
                </Button>
              </div>
            </div>
          </div>
          
          {/* Route Information */}
          {route && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Information</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Pickup</div>
                    <div className="font-medium">{pickupValue}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Dropoff</div>
                    <div className="font-medium">{dropoffValue}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-blue-600">
                  <Navigation className="h-4 w-4" />
                  <span className="text-sm font-medium">Route calculated</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Right column - Map */}
        <div className="md:w-2/3 h-[500px] bg-gray-100 rounded-lg">
          <MapView 
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            route={route}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;