import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventPage = ({ eventId }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.post(`http://localhost:3000/events/${eventId}`);
        console.log(response.data);
        setEvent(response.data);
      } catch (err) {
        setError('Failed to fetch event data');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!event) return <div>No event found</div>;

  return (
    <div>
      <h1>{event.eventName}</h1>
      <p>{event.eventDescription}</p>
      <p>
        From: {new Date(event.fromDate).toLocaleDateString()} | To:{' '}
        {new Date(event.toDate).toLocaleDateString()}
      </p>

      {/* Banner */}
      {event.eventBanner && (
        <img
          src={`${event.eventBanner}`}
          alt="Event Banner"
          style={{ width: '200px', height: '200px' }}
        />
      )}

      {/* Event Images */}
      <div>
        {event.images?.map((_, idx) => (
          <img
            key={idx}
            src={`${_}`}
            alt={`Event Image ${idx + 1}`}
            style={{ width: '100px', height: '100px', margin: '5px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default EventPage;
