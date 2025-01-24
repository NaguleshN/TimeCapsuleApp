import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import moment from 'moment';

const Timeline = () => {
  const [events, setEvents] = useState([]);

 
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/get_capsules_data/'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

       
        if (!Array.isArray(data)) {
          throw new Error('Expected an array of events');
        }

       
        const formattedEvents = data.map(event => {
          console.log(event); 

          return {
            title: event.capsuleName, 
            start: moment(event.unlockDate).format('YYYY-MM-DD'), 
            url: `/record/${event._id}`,
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
        alert(`Failed to load events! Error: ${error.message}`);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="ui container" style={{ marginTop: '50px', padding: '20px', backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
        initialView="dayGridMonth"
        events={events} 
        eventClick={(info) => {
          if (info.event.url) {
            window.location.href = info.event.url; 
          }
        }}
        eventColor="#ff9f89" 
      />
    </div>
  );
};

export default Timeline;