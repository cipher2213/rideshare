import React from 'react';
import { MapPin, Calendar, Clock, CheckCircle, XCircle, Clock3 } from 'lucide-react';
import { Ride, RideStatus } from '../../types';

interface RideCardProps {
  ride: Ride;
}

const RideCard: React.FC<RideCardProps> = ({ ride }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusIcon = (status: RideStatus) => {
    switch (status) {
      case RideStatus.COMPLETED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case RideStatus.CANCELLED:
        return <XCircle className="h-5 w-5 text-red-500" />;
      case RideStatus.PENDING:
      case RideStatus.CONFIRMED:
      default:
        return <Clock3 className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getStatusText = (status: RideStatus) => {
    switch (status) {
      case RideStatus.COMPLETED:
        return 'Completed';
      case RideStatus.CANCELLED:
        return 'Cancelled';
      case RideStatus.CONFIRMED:
        return 'Confirmed';
      case RideStatus.PENDING:
      default:
        return 'Pending';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition hover:shadow-md">
      {/* Status Badge */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-1 text-sm">
          {getStatusIcon(ride.status)}
          <span>{getStatusText(ride.status)}</span>
        </div>
        
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(ride.dateTime)}</span>
        </div>
      </div>
      
      {/* Pickup and Dropoff */}
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Pickup</div>
            <div className="font-medium">{ride.pickupLocation}</div>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Dropoff</div>
            <div className="font-medium">{ride.dropLocation}</div>
          </div>
        </div>
      </div>
      
      {/* Time */}
      <div className="flex items-center space-x-1 text-sm text-gray-500 mt-3">
        <Clock className="h-4 w-4" />
        <span>{formatTime(ride.dateTime)}</span>
      </div>
    </div>
  );
};

export default RideCard;