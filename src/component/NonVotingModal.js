import { useState, useEffect } from "react";
import ReactModal from "react-modal";
import '../asset/css/Voting.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell} from "@fortawesome/free-solid-svg-icons";

const NonVotingModal = ({ setNonStudentModalShow, nonVoters, votedStudentIds }) => {
    const [nonVotingModal, setNonVotingModal] = useState(true); // 모달 on/off

    const closeModalHandler = () => {
        setNonStudentModalShow(false);
        setNonVotingModal(false);
        console.log(nonVoters)
        console.log(votedStudentIds)
        // console.log(filteredNonVoters)
    };


    // const filteredNonVoters = nonVoters.filter(student => 
    //     !votedStudentIds.includes(student.studentId) 
    // );

    // console.log(filteredNonVoters); 
    return (
        <ReactModal
            isOpen={nonVotingModal}
            contentLabel="nonVoting 학생 modal"
            appElement={document.getElementById("root")}
            style={{
                content: {
                    top: "50%",
                    left: "50%",
                    right: "auto",
                    bottom: "auto",
                    marginRight: "-50%",
                    transform: "translate(-50%, -50%)",
                    width: 600,
                    borderRadius: 0,
                    border: "none",
                    padding: "42px",
                    fontSize: "30px"
                    // backgroundColor:"rgb(255,255,255,0.)"
                },
            }}
        >
            {nonVoters.length > 0 ? (
                <span className="non-voters">
                    <strong>[ 미투표자 ]</strong>
                    <br/>
                    <h4 style={{color:"red"}}> 투표 알림을 보낼 학생을 선택해주세요</h4>
                    <br/>
                    {console.log(nonVoters)}
                    <div className="non-voting-students-grid">
                    {nonVoters.map(student => (
                    <div key={student.id} className="student-info-row">
                        <div>{student.name}</div>
                        <button className="bell_icon"><FontAwesomeIcon icon={faBell} /></button>
                    </div>
                    ))}
                    </div>
                    <br />
                </span>
            ) : (
                <p style={{color:"red"}}>모든 학생이 투표를 완료했습니다.</p> 
            )}
            <button onClick={closeModalHandler}>닫기</button>
        </ReactModal>
    );
};

export default NonVotingModal;
