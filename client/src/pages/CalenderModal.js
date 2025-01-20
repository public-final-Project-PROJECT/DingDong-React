import {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import {DayPicker} from 'react-day-picker';
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
        const {name, value} = e.target;
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
            prevEvents.map((ev) => {
                console.log('Comparing IDs:', ev.id, props.event.id);
                return ev.id === props.event.id
                    ? {
                        ...ev,
                        title: event2.title,
                        description: event2.description,
                        start: EventToLocal(event2.start),
                        end: EventToLocal(event2.end),
                    }
                    : ev

            })
        );

        props.onHide(); // 모달 닫기
    };

    const Delete = (id) => {
        props.setEvents((pre) => pre.filter((item) => item.id !== id))

        props.onHide();
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
                    일정 상세 내용
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="modal-content">
                    <form id="event-form" onSubmit={handleSubmit} style={{display: 'flex', gap: '20px'}}>
                        {/* 왼쪽 영역 */}
                        <div style={{flex: 1}}>
                            <div>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="제목을 적어주세요"
                                    value={event2.title}
                                    onChange={handleChange}
                                    style={{width: '100%', marginBottom: '10px'}}
                                />
                            </div>

                            <div>
            <textarea
                id="description"
                name="description"
                placeholder="남기실 메모를 적어주세요"
                value={event2.description}
                onChange={handleChange}
                style={{width: '100%', height: '300px'}}
            />
                            </div>
                        </div>

                        {/* 오른쪽 영역 */}
                        <div style={{flex: 1}}>
                            <h4>일정 선택</h4>
                            <EventDatePicker event={props.event} setEvents={setEvent2}/>
                        </div>
                    </form>
                </div>
            </Modal.Body>

            <Modal.Footer>
                {/* 저장 및 삭제 버튼 */}
                <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end', width: '100%'}}>
                    <button
                        className="btn btn-primary"
                        type="submit"
                        form="event-form"
                    >
                        저장
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => {

                            Delete(props.event.id); // 삭제 로직 호출
                        }}
                    >
                        삭제
                    </button>
                    <Button variant="secondary" onClick={props.onHide}>
                        Close
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
        ;


}

function EventDatePicker(props) {
    const [event3, setEvent3] = useState([]);

    const normalizeDateToUTC = (date) => {
        if (!date || !(date instanceof Date) || isNaN(date)) return null;
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    };

    // 초기화: props.event의 날짜를 UTC로 변환
    useEffect(() => {
        const start = props.event.start ? normalizeDateToUTC(new Date(props.event.start)) : null;
        const end = props.event.end ? normalizeDateToUTC(new Date(props.event.end)) : null;

        setEvent3({start, end});
    }, [props.event]);

    // 날짜 범위 변경 핸들러
    const handleDateRangeChange = (range) => {
        if (!range?.from || !range?.to) return;

        const start = normalizeDateToUTC(new Date(range.from));
        const end = normalizeDateToUTC(new Date(range.to));

        const updatedEvent = {start, end};

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


const CalendarModal = ({event, onClose, setEvents}) => {


    const [modalShow, setModalShow] = useState(true);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleChange = (e) => {
        const {name, value} = e.target;
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