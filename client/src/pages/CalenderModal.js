import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

  







  function MyVerticallyCenteredModal(props) {

    const [event2, setEvent2] = useState({
      title: '',
      description: '',
      start: null,
      end: null,
    });
  
    useEffect(() => {
      if (props.event) {
        // props.event에서 필요한 데이터 초기화
        setEvent2({
          title: props.event._def?.title || '',
          description: props.event._def?.extendedProps?.description || '',
          start: props.event.start || null,
          end: props.event.end || null,
        });
      }
    }, [props.event]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEvent2((prevevent) => ({
          ...prevevent,
          [name]: value,
      }));

      console.log('Updated Event:', {
    ...event2,
    [name]: value,
  });
    }


    const handleSubmit = (e) => {
      e.preventDefault();
  
       // T 뒤의 데이터를 제거하는 함수
  const formatDate = (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환
  };


      props.setEvents((prevEvents) =>
        prevEvents.map((ev) =>{
          console.log('Comparing IDs:', ev.id, props.event.id);
         return ev.id === props.event.id 
            ? {
                ...ev,
                title: event2.title,
                description : event2.description,
                start: formatDate(event2.start),
                end: formatDate(event2.end),
              }
            : ev 
    })
      );
      
      props.onHide(); // 모달 닫기
    };

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Modal heading
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          <h4>일정 수정</h4>
          <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="noticeTitle">제목:</label>
                    
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={event2.title}
                        onChange={handleChange}
                    />
                </div>


                  <div>
                    <h3>일정 선택</h3>
                    <EventDatePicker event={props.event} setEvents={setEvent2}  />
                    <div>
                      <p>선택된 시작일: {props.event.start?.toLocaleDateString() || '없음'}</p>
                      <p>선택된 종료일: {props.event.end?.toLocaleDateString() || '없음'}</p>
                    </div>
                  </div>


                <div>
                    <label htmlFor="noticeContent">내용:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={event2.description}
                        onChange={handleChange}
                    />
                </div>
                
                <button type="submit">수정하기</button>
            </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );

    
  }
  function EventDatePicker(props) {
    const [event3,setEvent3] = useState([]);


    useEffect(()=>{
      setEvent3( { start: props.event.start || null,
        end: props.event.end || null});
    },[])

    const handleDateRangeChange = (range) => {
      const updatedEvent = {
        start: range?.from || null,
        end: range?.to|| null,
      };
      setEvent3(updatedEvent);
      
      props.setEvents((prevevent) => ({
        ...prevevent,
        start: range?.from || null,
        end: range?.to || null,
    }));
      
    console.log(range.to);

    };
  
    return (
      <div>
        <DayPicker
          mode="range"
          selected={{
            from: event3.start, // 선택된 시작일
            to: event3.end, // 선택된 종료일
          }}
          onSelect={handleDateRangeChange} // 범위 선택 변경 핸들러
        />
      </div>
    );
  }
  

const CalendarModal =({event,onClose,setEvents})=> {

    
    const [modalShow, setModalShow] = useState(true);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEvents((prevevent) => ({
          ...prevevent,
          [name]: value,
      }));
  };


    const handleSubmit = async (e) => {
      
      try {
        const response = await fetch('http://localhost:3013/calendar/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
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
          selectable: true,
        };
    
      setEvents((prevEvents) => [...prevEvents, formattedEvent]);
        
        
       
      } catch (err) {
        
      }
      
      
    };
  


    return (
      <>
       
        <MyVerticallyCenteredModal
          event={event}
          setEvents={setEvents}
          show={modalShow}     
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          onHide={() => onClose(false)}
        />
      </>
    );
  }
 
export default CalendarModal;