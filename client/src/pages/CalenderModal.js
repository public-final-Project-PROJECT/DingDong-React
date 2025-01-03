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
  

      const EventToLocal = (date) => {
        if (!date) return null;
      
        // 'YYYY-MM-DD' 형식으로 변환
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };




      props.setEvents((prevEvents) =>
        prevEvents.map((ev) =>{
          console.log('Comparing IDs:', ev.id, props.event.id);
         return ev.id === props.event.id 
            ? {
                ...ev,
                title: event2.title,
                description : event2.description,
                start: EventToLocal(event2.start),
                end: EventToLocal(event2.end),
              }
            : ev 

    })
      );
      
      props.onHide(); // 모달 닫기
    };

    const Delete = (id)=>{
      props.setEvents((pre)=> pre.filter((item)=> item.id !== id))

    }

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
                    
                  </div>


                <div>
                    <label htmlFor="noticeContent"></label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder='남기실메모를 적어주세요'
                        value={event2.description}
                        onChange={handleChange}
                    />
                </div>
                <div className='updatedelete'>
                <button type="submit">수정하기</button>
                <button onClick={()=>Delete(props.event.id)}>삭제하기</button>
                </div>
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
    
    const normalizeDateToUTC = (date) => {
      if (!date || !(date instanceof Date) || isNaN(date)) return null;
      return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    };
  
    // 초기화: props.event의 날짜를 UTC로 변환
    useEffect(() => {
      const start = props.event.start ? normalizeDateToUTC(new Date(props.event.start)) : null;
      const end = props.event.end ? normalizeDateToUTC(new Date(props.event.end)) : null;
  
      setEvent3({ start, end });
    }, [props.event]);
  
    // 날짜 범위 변경 핸들러
    const handleDateRangeChange = (range) => {
      if (!range?.from || !range?.to) return;
  
      const start = normalizeDateToUTC(new Date(range.from));
      const end = normalizeDateToUTC(new Date(range.to));
  
      const updatedEvent = { start, end };
  
      setEvent3(updatedEvent);
  
      // 상위 컴포넌트로 업데이트된 이벤트 전달
      props.setEvents((prevEvents) => ({
        ...prevEvents,
        start,
        end,
      }));
    }
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


  
  


    return (
      <>
       
        <MyVerticallyCenteredModal
          event={event}
          setEvents={setEvents}
          show={modalShow}     
          
          handleChange={handleChange}
          onHide={() => onClose(false)}
        />
      </>
    );
  }
 
export default CalendarModal;