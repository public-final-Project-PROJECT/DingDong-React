import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {useState, useEffect, useMemo, useRef} from 'react';
import CalendarModal from './CalenderModal';
import googleCalendarPlugin from '@fullcalendar/google-calendar';


const Calendar = ({showControls = true}) => {


    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState({start: null, end: null, color: null}); // 선택된 날짜 상태
    const [selectedRange, setSelectedRange] = useState({start: null, end: null});
    const [googleEventSources, setGoogleEventSources] = useState([]);
    const [events, setEvents] = useState([]);

    const [eventDescription, setEventDescription] = useState(''); // 텍스트 입력 상태
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 여부
    const [selectedEvent, setSelectedEvent] = useState(null); // 클릭된 이벤트 정보
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        // 중복된 ID 덮어쓰기
        const deduplicatedEvents = events.reduce((acc, event) => {
            acc[event.id] = event; // 같은 ID가 있으면 덮어씀
            return acc;
        }, {});

        // 객체를 배열로 변환 후 상태 업데이트
        setEvents(Object.values(deduplicatedEvents));
    }, []); // 컴포넌트가 처음 렌더링될 때 실행


    // 이벤트 소스 초기화
    const initializeDefaultSources = async () => {
        console.log("Initializing default sources...");
        return new Promise((resolve, reject) => {
            const initialSources = [
                {
                    googleCalendarId: "ko.south_korea#holiday@group.v.calendar.google.com",
                    className: "ko_event",
                    color: "rgb(86, 204, 86)",
                    textColor: "white",
                },
            ];


            setGoogleEventSources(initialSources); // 상태 업데이트


            // 성공적으로 데이터가 로드되었다고 가정
            resolve("Google Calendar loaded successfully!");

            localStorage.setItem("googleEventSources", JSON.stringify(initialSources)); // 로컬 저장소


        });
    };
    const loadPlugins = async () => {
        console.log("Loading plugins...");

        try {
            await initializeDefaultSources(); // 소스 초기화
            console.log("All plugins loaded successfully!");
            setTimeout(() => {
                setLoading(false); // 로딩 실패
            }, 0);
        } catch (error) {
            console.error("Error loading plugins:", error); // 실패 처리
            setLoading(false); // 로딩 실패
        }

    };

    useEffect(() => {
        loadPlugins(); // 플러그인 초기화
    }, []);


    // 선택된 날짜 범위 색상 적용 로직
    useEffect(() => {

        const allDayCells = document.querySelectorAll('.fc-daygrid-day');
        if ((selectedRange.start && selectedRange.end) || selectedDate) {
            const {start, end, color} = selectedRange;
            const startDate = new Date(start);
            const endDate = new Date(end);


            allDayCells.forEach((cell) => {
                const cellDate = cell.getAttribute('data-date');
                const cellDateObj = new Date(cellDate);

                if (cellDateObj >= startDate && cellDateObj < endDate) {
                    cell.style.backgroundColor = color;
                } else {
                    cell.style.backgroundColor = ''; // 나머지 날짜 색상 초기화
                }
            });
        }

    }, [selectedRange, selectedDate, selectedEvent]);

    // 데이터 가져오기

    // 날짜 클릭 처리
    const handleDateClick = (clickInfo) => {
        if (!showControls) return;
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
        console.log(clickInfo.event.start);
        setIsModalOpen(true);

        setSelectedEvent(clickInfo.event);
    };

    // 날짜 선택 처리
    const handleDateSelect = (selectInfo) => {
        if (!showControls) return;
        const startDate = selectInfo.startStr;
        const endDate = selectInfo.endStr;

        setSelectedRange((prev) =>
            prev.start === startDate ? {start: null, end: null, color: ''} : {
                start: startDate,
                end: endDate,
                color: 'rgba(88, 157, 45, 0.17)'
            }
        );
    };

    // 텍스트 입력 값 처리
    const handleDescriptionChange = (e) => {
        setEventDescription(e.target.value);
    };

    // 이벤트 생성 처리
    const handleCreateEvent = () => {
        if (selectedRange.start) {
            const newEvent = {
                id: `${events.length + 1}`,
                title: eventDescription,

                start: new Date(selectedRange.start),
                end: new Date(selectedRange.end),
                className: ['user_event'],

            };
            console.log('selectedRange.start:', selectedRange.start);
            console.log('selectedRange.end:', selectedRange.end);

            setSelectedEvent(newEvent);
            setIsModalOpen(true);
            setEvents((prevEvents) => [...prevEvents, newEvent]);


            setEventDescription('');
            setSelectedRange({start: null, end: null, color: ''});


        }
    };


    useEffect(() => {
        handleSubmit();

    }, [])

    const handleUpdate = async (e) => {

        const eventupdate = events;


        eventupdate.map((event) => {
            console.log('Event Details:', event); // 각 이벤트 객체 출력
            return {
                ...event, // 기존 이벤트 데이터
                start: event.start,
                end: event.end,
            };

        });


        try {
            const response = await fetch('http://localhost:3013/calendar/update', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(eventupdate),
            });


        } catch (err) {

        }


    };


    const handleSubmit = async (e) => {

        try {
            const response = await fetch('http://localhost:3013/calendar/list', {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},

            });
            const eventList = await response.json(); // 단일 이벤트 데이터 가져오기

            // 서버에서 받은 단일 이벤트를 FullCalendar 형식으로 변환
            const formattedEvent = eventList.map((eventData) => ({
                    id: String(eventData.calendarId),
                    title: eventData.title, // 이벤트 제목
                    description: eventData.description,
                    start: eventData.start,
                    end: eventData.end,
                    className: ['fc-h-event', 'user_event'], // 사용자 지정 클래스


                }


            ));
            setEvents((prevEvents) => {
                const existingIds = new Set(prevEvents.map((event) => event.id)); // 기존 ID 수집
                const filteredEvents = formattedEvent.filter(
                    (event) => !existingIds.has(event.id) // 중복된 ID가 없는 이벤트만 추가
                );

                return [...prevEvents, ...filteredEvents]
            });

            console.log(events);
            setError(null);
        } catch (err) {
            setError(err.message);
        }


    };

    // 이벤트 드래그 후 이동 처리
    const handleEventDrop = (dropInfo) => {
        const {id, startStr, endStr} = dropInfo.event;
        console.log(id);

        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === id ? {...event, start: startStr, end: endStr} : event
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


    const handleEventResize = (info) => {
        // 리사이즈된 이벤트 데이터 생성

        const EventToLocal = (date) => {
            if (!date) return null;

            // 'YYYY-MM-DD' 형식으로 변환
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const resizedEvent = {
            id: info.event.id,
            start: EventToLocal(info.event.start),
            end: EventToLocal(info.event.end),
        };


        console.log(info.event.end);

        setEvents((prevEvents) =>
            prevEvents.map((events =>
                    events.id === resizedEvent.id ? {...events, start: resizedEvent.start, end: resizedEvent.end}
                        : events
            )))


    };


    return (
        <>
            <div className="inner">


                <div className="full-calendar-container" style={{visibility: loading ? "hidden" : "visible"}}>
                    <FullCalendar

                        plugins={[dayGridPlugin, interactionPlugin, googleCalendarPlugin]}
                        initialView="dayGridMonth"
                        googleCalendarApiKey="AIzaSyA3_A-B-m1UVa7Oye7j9Vtw4JyeYlqOgiw"
                        eventSources={[...googleEventSources, events]}
                        initialEvents={[events]}


                        dateClick={handleDateClick}
                        selectable
                        select={handleDateSelect}
                        editable={showControls}
                        eventClick={handleEventClick}
                        eventDrop={handleEventDrop}
                        datesSet={handleDateChange}
                        eventResize={handleEventResize}
                        eventResizableFromStart={showControls}
                        dayMaxEventRows={2}
                        timeZone="local"
                        height="120%"
                        expandRows={false}

                        contentHeight="auto"
                        headerToolbar={{
                            left: 'prev,today',
                            center: 'title',
                            right: 'next',
                            // backgroundColor: "rgba(88, 157, 45, 0.17)",
                        }}

                        eventContent={(arg) => {
                            if (arg.event.classNames.includes('user_event')) {
                                return (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        borderColor: "#205736",
                                    }}>
                    <span
                        style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: arg.event.backgroundColor || '#205736',
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
                {showControls && (
                    <div>


                            <button
                                className="btn btn-warning"
                                onClick={handleCreateEvent}
                                style={{
                                    position: 'absolute',
                                    top: '107px',
                                    right: '480px',
                                    backgroundColor: "#205736",
                                    border:"#205736",
                                    color: "#fff",
                                }}
                            >
                                생성
                            </button>

                            <button
                                className="btn btn-warning"
                                onClick={handleUpdate}
                                style={{
                                    position: 'absolute',
                                    top: '107px',
                                    right: '400px',
                                    backgroundColor: "#205736",
                                    color: "#fff",
                                    border: "#205736",
                                }}
                            >
                                저장
                            </button>



                        {isModalOpen && (
                            <CalendarModal
                                setEvents={setEvents}
                                event={selectedEvent}
                                onClose={() => setIsModalOpen(false)}
                            />
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Calendar;
