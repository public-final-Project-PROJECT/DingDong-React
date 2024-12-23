import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect } from 'react';
import CalendarModal from './CalenderModal';

const Calendar = () => {
  const [test, setTest] = useState(0);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 상태
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [dragging, setDragging] = useState(false); // 드래그 상태 관리
  const [events, setEvents] = useState([
    { id: '1', title: 'Event 1', start: '2024-12-25' },
    { id: '2', title: 'Event 2', start: '2024-12-31' },
  ]);
  const [eventDescription, setEventDescription] = useState(''); // 텍스트 입력 상태
  const [currentRange, setCurrentRange] = useState({
    start: null,
    end: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 여부
  const [selectedEvent, setSelectedEvent] = useState(null); // 클릭된 이벤트 정보
  useEffect(() => {
    if (selectedRange || currentRange) {
      const { start, end, color } = selectedRange;
      const startDate = new Date(start);
      const endDate = new Date(end);
        console.log(startDate);
      // 모든 날짜 셀 가져오기
      const allDayCells = document.querySelectorAll('.fc-daygrid-day');

    

      allDayCells.forEach((cell) => {
        const cellDate = cell.getAttribute('data-date');
        const cellDateObj = new Date(cellDate);
        cell.style.backgroundColor = color ; // 선택된 날짜 배경색
        // 선택된 날짜 범위에 속하는 셀에 색상 적용
        if (cellDateObj >= startDate && cellDateObj < endDate) {
            cell.style.backgroundColor = color ; // 선택된 날짜 배경색
          console.log(selectedRange);
        } else {
          cell.style.backgroundColor = ''; // 나머지 날짜 색상 초기화
        }
      });
      
    }
  }, [selectedRange]); // selectedRange가 변경될 때마다 실행

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

  // 날짜 클릭 처리
  const handleDateClick = (clickInfo) => {
    // 클릭한 날짜의 배경 색상 변경
    if (clickInfo.dragged) return;

    
        
        clickInfo.dayEl.style.backgroundColor = '#fdc882'; 
        
        setSelectedDate(clickInfo.dayEl); 
        
        
    
    
  }

  const handleEventClick = (clickInfo) => {

    
    // // 클릭된 이벤트의 제목을 수정하는 프로세스
    // const updatedTitle = prompt('Edit event title:', clickInfo.event.title);

    // if (updatedTitle) {
    //   clickInfo.event.setProp('title', updatedTitle); // 이벤트의 제목을 수정
    // }
    setIsModalOpen(true); // 모달 열기
    setSelectedEvent(clickInfo.event);
       

  }

  const handleDateSelect = (selectInfo) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // 선택 해제

    const startDate = selectInfo.startStr;
    const endDate = selectInfo.endStr;

    // 선택된 날짜 범위를 상태로 저장
    setSelectedRange({
      start: startDate,
      end: endDate,
      color: '#f0ad4e'
    });
    if(selectedRange.start == selectInfo.startStr){
        setSelectedRange({color: ""}); // 범위 초기화
    }
  };

  const handleDescriptionChange = (e) => {
    setEventDescription(e.target.value); // 텍스트 입력 값 변경
  };

  // 이벤트 생성 처리 (예: 범위에 텍스트 추가) //여기에 추가하면될듯
  const handleCreateEvent = () => {
    if (selectedRange && eventDescription) {
      const newEvent = {
        id: `${events.length + 1}`,
        title: eventDescription,
        start: selectedRange.start,
        end: selectedRange.end,
      };

      setEvents([...events, newEvent]); // 이벤트 목록에 추가
      setEventDescription(''); // 텍스트 입력 필드 초기화
      setSelectedRange({color: ""}); // 범위 초기화
    }
  };

  const handleDateChange = (info) => {
    const start = info.view.currentStart; // 새로운 뷰의 시작 날짜
    const end = info.view.currentEnd; // 새로운 뷰의 끝 날짜

    // 상태 업데이트
    setSelectedRange(prevRange => ({ ...prevRange }))

    console.log('Current Range:', start, 'to', end); // 현재 날짜 범위 로그 찍기

 
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

        {/* 선택된 날짜 범위에 텍스트 입력 필드 표시 */}
        {selectedRange && (
          <div>
            <label>
              Event Description:
              <input
                type="text"
                value={eventDescription}
                onChange={handleDescriptionChange}
                placeholder="Enter event description"
              />
            </label>
            <button onClick={handleCreateEvent}>Create Event</button>
          </div>
        )}

        <div className="full-calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={handleDateClick} // 날짜 클릭 시 색상 변경
            selectable={true}
            select={handleDateSelect}
            editable={true}
            events={events}
            eventClick={handleEventClick} // 이벤트 클릭 시 수정
            droppable={true}
            datesSet={handleDateChange}
            
            
            eventContent={(eventInfo) => {
              return (
                <div>
                  <strong>{eventInfo.event.title}</strong>
                </div>
              );
            }}
          />
        </div>
        {isModalOpen && (
                <CalendarModal
                  event={selectedEvent}
                  onClose={setIsModalOpen} // 모달 닫기
                />
              )}

      </div>
    </>
  );
};

export default Calendar;
