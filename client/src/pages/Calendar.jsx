import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect, useMemo, useRef } from 'react';
import CalendarModal from './CalenderModal';
import googleCalendarPlugin from '@fullcalendar/google-calendar';


const Calendar = () => {
  const [test, setTest] = useState(0);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState({ start: null, end: null, color: null }); // 선택된 날짜 상태
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [googleEventSources, setGoogleEventSources] = useState([]);
  const [events, setEvents] = useState([
    
  ]);
  const [eventDescription, setEventDescription] = useState(''); // 텍스트 입력 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 여부
  const [selectedEvent, setSelectedEvent] = useState(null); // 클릭된 이벤트 정보
  const [loading,setLoading] = useState(false);
  const calendarRef = useRef(null);
  // Google Calendar 이벤트 소스를 설정
  useEffect(() => {
    localStorage.removeItem('googleEventSources');
    const savedSources = localStorage.getItem('googleEventSources');
    if (savedSources) {
      try {
        const parsedSources = JSON.parse(savedSources);
        if (Array.isArray(parsedSources)) {
          setGoogleEventSources(parsedSources);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Error parsing googleEventSources:", error);
        initializeDefaultSources();
      }
    } else {
      initializeDefaultSources();
    }
    setLoading(true);
  }, []);


  


  const initializeDefaultSources = () => {
    const initialSources = [
      {
        googleCalendarId: "ko.south_korea#holiday@group.v.calendar.google.com",
        className: 'ko_event',
        color: '#FFDD57',
        textColor: 'black',
      },
    ];
    setGoogleEventSources(initialSources);
    localStorage.setItem('googleEventSources', JSON.stringify(initialSources));
  };

  // 선택된 날짜 범위 색상 적용 로직
  useEffect(() => {
    if(loading){
    const allDayCells = document.querySelectorAll('.fc-daygrid-day');
    if ((selectedRange.start && selectedRange.end) || selectedDate ) {
      const { start, end, color } = selectedRange;
      const startDate = new Date(start);
      const endDate = new Date(end);

      

      allDayCells.forEach((cell) => {
        const cellDate = cell.getAttribute('data-date');
        const cellDateObj = new Date(cellDate);

        if (cellDateObj >= startDate && cellDateObj < endDate) {
          cell.style.backgroundColor = color;
        }
        
        else {
          cell.style.backgroundColor = ''; // 나머지 날짜 색상 초기화
        }
      });
    }
  }
  }, [loading,selectedRange,selectedDate]);

  // 데이터 가져오기
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3013/calendar/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: test }),
      });
      const eventData = await response.json(); // 단일 이벤트 데이터 가져오기
      
      // 서버에서 받은 단일 이벤트를 FullCalendar 형식으로 변환
      const formattedEvent = {
        id: String(eventData.calendarId),
        title: eventData.title, // 이벤트 제목
        start: eventData.startDatetime, // 시작 날짜 (ISO8601 형식)
        end: eventData.endDatetime, // 종료 날짜 (ISO8601 형식)
        className: ['fc-h-event','user_event'], // 사용자 지정 클래스
        startEditable: true,           // 시작 시간 리사이즈 가능
        durationEditable: true,
        editable: true, 
      };
  
      setEvents((prevEvents) => [...prevEvents, formattedEvent]);
      console.log(events);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
    
  };

  // 날짜 클릭 처리
  const handleDateClick = (clickInfo) => {
    if (clickInfo.dragged) return;
  
    const selectedCell = document.querySelector('.selected-day'); // 선택된 날짜 셀 확인
    const isSameDate = selectedDate === clickInfo.dateStr; // 현재 클릭한 날짜가 이미 선택된 날짜인지 확인
    
    // 기존 선택된 날짜 초기화
    if (selectedCell) {
      selectedCell.style.backgroundColor = ''; // 색상 초기화
      selectedCell.classList.remove('selected-day'); // 클래스 제거
    }
  
    // 동일한 날짜를 클릭하면 선택 해제
    if (isSameDate) {
      setSelectedDate(null); // 상태 초기화
      return;
    }
  
    // 새로 선택된 날짜 스타일 적용
    clickInfo.dayEl.style.backgroundColor = '#fdc882'; // 선택된 날짜 색상
    clickInfo.dayEl.classList.add('selected-day'); // 클래스 추가
    setSelectedDate(clickInfo.dateStr); // 상태 업데이트
    console.log(selectedDate);
  };

  // 이벤트 클릭 처리
  const handleEventClick = (clickInfo) => {
    if (clickInfo.event.classNames.includes('ko_event')) {
      return;
    }
    setIsModalOpen(true);
    
    setSelectedEvent(clickInfo.event);
  };

  // 날짜 선택 처리
  const handleDateSelect = (selectInfo) => {
    const startDate = selectInfo.startStr;
    const endDate = selectInfo.endStr;
    
    setSelectedRange((prev) =>
      prev.start === startDate ? { start: null, end: null, color: '' } : { start: startDate, end: endDate, color: '#f0ad4e' }
    );
  };

  // 텍스트 입력 값 처리
  const handleDescriptionChange = (e) => {
    setEventDescription(e.target.value);
  };

  // 이벤트 생성 처리
  const handleCreateEvent = () => {
    if (selectedRange.start && eventDescription) {
      const newEvent = {
        id: `${events.length + 1}`,
        title: eventDescription,
        start: selectedRange.start,
        end: selectedRange.end,
        className: ['user_event'],
        editable: true, 
      };

      setEvents((prevEvents) => [...prevEvents, newEvent]);
      setEventDescription('');
      setSelectedRange({ start: null, end: null, color: '' });
    }
  };

  // 이벤트 드래그 후 이동 처리
  const handleEventDrop = (dropInfo) => {
    const { id, startStr, endStr } = dropInfo.event;
    console.log(id);
    
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id ? { ...event, start: startStr, end: endStr } : event

   
      )
      
    );
    console.log(events);
  };

  // 현재 날짜 범위 변경 처리
  const handleDateChange = (info) => {
    const start = info.view.currentStart;
    const end = info.view.currentEnd;
    console.log('Current Range:', start, 'to', end);
  };

  const showCalendar = () => {
    const calendarElement = document.querySelector('.full-calendar-container'); 
    if (calendarElement) {
      
        calendarElement.style.visibility = 'visible'; 
      
      
      
    }
  };
  useEffect(() => {
    if (!loading) {
      setInterval(() => {
      showCalendar();
    }, 100);
    }
  }, [loading]);

  const handleEventResize = (info) => {
    // 리사이즈된 이벤트 데이터 생성
    const resizedEvent = {
      id: info.event.id,
      start: info.event.start.toISOString(),
      end: info.event.end ? info.event.end.toISOString() : null,
    };
  
    console.log('Resized Event:', resizedEvent);
  
  
    

    
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
     
          
          
        <div className="full-calendar-container">
          <FullCalendar
             
            plugins={[dayGridPlugin, interactionPlugin, googleCalendarPlugin]}
            initialView="dayGridMonth"
            googleCalendarApiKey="AIzaSyA3_A-B-m1UVa7Oye7j9Vtw4JyeYlqOgiw"
            eventSources={[...googleEventSources,events]}
           
            eventOrder={(a, b) => {
              // 공휴일 이벤트는 항상 우선적으로 표시
              const isAHoliday = a.classNames?.includes('ko_event') || false;
              const isBHoliday = b.classNames?.includes('ko_event') || false;
          
              if (isAHoliday && !isBHoliday) return -1; // a를 위로
              if (!isAHoliday && isBHoliday) return 1;  // b를 위로
              return 0; // 공휴일이 아니면 기본 순서 유지
            }}
                        
            dateClick={handleDateClick}
            selectable
            select={handleDateSelect}
            editable={true}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            datesSet={handleDateChange}
            eventResize={handleEventResize}
            eventResizableFromStart={true}
            

            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay',
            }}
            
            eventContent={(arg) => {
              if (arg.event.classNames.includes('user_event')) {
                return (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: arg.event.backgroundColor || '#000',
                        borderRadius: '50%',
                        marginRight: '5px'
                        
                      }}
                    ></span>
                    {arg.event.title}
                  </div>
                );
              }
              return arg.event.title;
            }}
          />
        </div>
          

        {isModalOpen && (
          <CalendarModal
            event={selectedEvent}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default Calendar;
