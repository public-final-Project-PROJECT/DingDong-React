import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { useState, useEffect } from 'react';

const Calendar = () => {
  const [test, setTest] = useState(0);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 상태
  const [selectedRange, setSelectedRange] = useState(null); // 선택된 날짜 범위 관리
  const [events, setEvents] = useState([
    { id: '1', title: 'Event 1', start: '2024-12-25' },
    { id: '2', title: 'Event 2', start: '2024-12-31' },
  ]);

  useEffect(() => {
    // 드래그 가능한 요소 초기화
    const draggableElement = document.getElementById('draggable');
    if (draggableElement) {
      new Draggable(draggableElement, {
        eventData: { title: 'Dragged Event' }, // 드래그 시 전달할 이벤트 데이터
      });
    }
  }, []);
  const handleDateSelect = (selectInfo) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // 선택 해제

    // 선택된 날짜 범위
    const startDate = selectInfo.startStr;
    const endDate = selectInfo.endStr;
    // 선택된 날짜 범위를 상태로 저장
    setSelectedRange({
      start: startDate,
      end: endDate,
    });

    // 선택된 날짜 범위의 배경 색상 변경
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 각 날짜를 확인하여 배경색 변경
    const allDayCells = document.querySelectorAll('.fc-daygrid-day');
    allDayCells.forEach((cell) => {
      const cellDate = cell.getAttribute('data-date');
      const cellDateObj = new Date(cellDate);

      if (cellDateObj >= start && cellDateObj < end) {
        cell.style.backgroundColor = '#ffeb3b'; // 선택된 날짜에 색상 적용
      } else {
        cell.style.backgroundColor = ''; // 나머지 날짜 색상 초기화
      }
    });
  };
// 값 가져오기
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3013/calendar/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: test }),
      });
      const jsonData = await response.json();
      setResponseData(jsonData); // JSON 데이터를 상태로 저장
      console.log('Response:', jsonData);
      setError(null); // 에러 초기화
    } catch (err) {
      setError(err.message); // 에러 상태 업데이트
      console.error('Error fetching data:', err);
    }
  }
    //클릭한타일
    const handleDateClick = (clickInfo) => {
        // 클릭한 날짜의 배경 색상 변경
        if (clickInfo.dragged) return;

        if (selectedDate) {
          selectedDate.style.backgroundColor = ''; // 이전에 클릭한 날짜의 색상 원래대로 돌리기
        }
    
        // 새로운 클릭된 날짜 색상 변경
        clickInfo.dayEl.style.backgroundColor = '#f0ad4e'; // 클릭한 날짜 배경색 변경
        setSelectedDate(clickInfo.dayEl); // 선택된 날짜 상태 업데이트
      }

  const handleEventClick = (clickInfo) => {
    // 클릭된 이벤트의 제목을 수정하는 프로세스
    const updatedTitle = prompt('Edit event title:', clickInfo.event.title);

    if (updatedTitle) {
      clickInfo.event.setProp('title', updatedTitle); // 이벤트의 제목을 수정
    }
}
    useEffect(() => {
        if (selectedRange) {
          const start = new Date(selectedRange.start);
          const end = new Date(selectedRange.end);
    
          // 모든 날짜 셀 가져오기
          const allDayCells = document.querySelectorAll('.fc-daygrid-day');
          allDayCells.forEach((cell) => {
            const cellDate = new Date(cell.getAttribute('data-date'));
    
            // 선택된 날짜 범위에 속하는 셀에 색상 적용
            if (cellDate >= start && cellDate < end) {
              cell.style.backgroundColor = '#ffeb3b'; // 선택된 날짜 배경색
            } else {
              cell.style.backgroundColor = ''; // 선택되지 않은 날짜 초기화
            }
          });
        }
      }, [selectedRange]);
    

  
 const handleEventDrop = (info) => {
    // 드래그 후 이벤트 위치 변경 처리
    const updatedEvents = events.map(event => 
      event.title === info.event.title
        ? { ...event, date: info.event.startStr } // 새로운 날짜로 업데이트
        : event
    );
    setEvents(updatedEvents);
  };

  


  return (
    <>
      <div className="inner">
       
        <form onSubmit={handleSubmit}>
          <label htmlFor="testInput">Test Input: </label>
          <input
            id="testInput"
            type="text"
            value={test}
            onChange={(e) => setTest(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>

        
        {error && (
          <div style={{ color: 'red' }}>
            <h2>Error:</h2>
            <p>{error}</p>
          </div>
        )}

        {responseData && (
          <div>
            <h2>Response Data:</h2>
            <pre>{JSON.stringify(responseData, null, 2)}</pre>
          </div>
        )}

       
        <div
          id="draggable" >
          Drag me!1321312
        </div>

        

        <div className="full-calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={handleDateClick} // 날짜 클릭 시 색상 변경
            selectable={true}
            select={handleDateSelect} 
             //eventDrop={handleEventDrop}
            editable={true}
            events={events}
            eventClick={handleEventClick} // 이벤트 클릭 시 수정
            droppable={true} 
            eventDrop={handleEventDrop}
           // selectOverlap={false}
            
            eventContent={(eventInfo) => {
                return (
                  <div>
                    <strong>{eventInfo.event.title}</strong> 
                  </div>
                );
              }}
          />
          {console.log()}
        </div>
      </div>
    </>
  );
};

export default Calendar;
