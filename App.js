import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const App = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState("");
  const [editEvent, setEditEvent] = useState({ id: null, title: "", date: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/events')
      .then(response => setEvents(response.data));
  }, []);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleAddEvent = () => {
    if (newEvent) {
      axios.post('http://localhost:5000/events', { title: newEvent, date: date.toDateString() })
        .then(response => {
          setEvents([...events, response.data]);
          setNewEvent("");
        });
    }
  };

  const handleEditEvent = () => {
    if (editEvent.title) {
      axios.put(`http://localhost:5000/events/${editEvent.id}`, { title: editEvent.title, date: editEvent.date })
        .then(response => {
          const updatedEvents = events.map(event =>
            event.id === response.data.id ? response.data : event
          );
          setEvents(updatedEvents);
          setEditEvent({ id: null, title: "", date: "" });
        });
    }
  };

  const handleDeleteEvent = (id) => {
    axios.delete(`http://localhost:5000/events/${id}`)
      .then(() => {
        const filteredEvents = events.filter(event => event.id !== id);
        setEvents(filteredEvents);
      });
  };

  const handleSearch = () => {
    const encodedTitle = encodeURIComponent(searchQuery);
    axios.get(`http://localhost:5000/events/search?title=${encodedTitle}`)
      .then(response => {
        setFilteredEvents(response.data);
      })
      .catch(error => console.error("검색 중 오류 발생:", error));
  };

  const tileContent = ({ date }) => {
    const eventCount = events.filter(event => new Date(event.date).toDateString() === date.toDateString()).length;
    return eventCount > 0 ? <div className="event-count">{eventCount}</div> : null;
  };

  return (
    <div>
      <h1>일정 관리 앱</h1>
      <Calendar
        onChange={handleDateChange}
        value={date}
        tileContent={tileContent}
      />
      <div>
        <input
          type="text"
          value={newEvent}
          onChange={(e) => setNewEvent(e.target.value)}
          placeholder="일정을 입력하세요"
        />
        <button onClick={handleAddEvent}>추가</button>
      </div>
      <div>
        {editEvent.id && (
          <div>
            <input
              type="text"
              value={editEvent.title}
              onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
              placeholder="수정할 일정을 입력하세요"
            />
            <button onClick={handleEditEvent}>수정</button>
          </div>
        )}
      </div>

      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="일정 제목으로 검색"
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      <h2>검색 결과</h2>
      <ul>
        {filteredEvents.map((event) => (
          <li key={event.id}>
            {event.title} ({event.date})
            <button onClick={() => {
              setEditEvent({ id: event.id, title: event.title, date: event.date });
            }}>수정</button>
            <button onClick={() => handleDeleteEvent(event.id)}>삭제</button>
          </li>
        ))}
      </ul>

      <h2>{date.toDateString()} 일정</h2>
      <ul>
        {events.filter(event => event.date === date.toDateString()).map((event) => (
          <li key={event.id}>
            {event.title}
            <button onClick={() => {
              setEditEvent({ id: event.id, title: event.title, date: event.date });
            }}>수정</button>
            <button onClick={() => handleDeleteEvent(event.id)}>삭제</button>
          </li>
        ))}
      </ul>

      <h2>전체 일정 목록</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.title} ({event.date})
            <button onClick={() => {
              setEditEvent({ id: event.id, title: event.title, date: event.date });
            }}>수정</button>
            <button onClick={() => handleDeleteEvent(event.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
