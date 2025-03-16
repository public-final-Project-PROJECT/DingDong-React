import { useState, useEffect } from "react";
import ReactModal from "react-modal";
import '../asset/css/NonVotingModal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useUserData } from "../hooks/useUserData";

const NonVotingModal = ({ setNonStudentModalShow, nonVoters, voteId }) => {
    const [nonVotingModal, setNonVotingModal] = useState(true); 
    const { selectedClassId } = useUserData();

    const closeModalHandler = () => {
        setNonStudentModalShow(false);
        setNonVotingModal(false);
    };


     const votingNonStudentAlert = async (studentId, voteId) => {

        try {
            const response = await axios.post(
              `http://localhost:3013/api/alert/votingUserAlertSave`,
              {
                classId: selectedClassId, 
                studentId : studentId,
                votingId : voteId
              },
       
            );
            alert("미 투표 학생에게 알림을 보냅니다 !");
            return response.data;
            
          } catch (error) {
            console.error("투표 생성 api error:", error.response || error.message);
          }

         }


    return (
        <ReactModal
            isOpen={nonVotingModal}
            className="non-voting-modal"
            contentLabel="nonVoting 학생 modal"
        >
            {nonVoters.length > 0 ? (
                <span className="non-voters">
                    <strong className="nonVoting-title">[ 미투표 학생 ]</strong><br/><br/>
                    <h4 className="non-voting-modal-title"> 투표 알림을 보낼 학생을 선택해주세요</h4><hr/>
                    
                    <div className="non-voting-students-grid">
                    {nonVoters.map(student => (
                    <div key={student.id} className="student-info-row">
                        <div className="student-info-row">{student.name}</div>
                        <button className="bell_icon" onClick={() => votingNonStudentAlert(student.id, voteId)}>  <FontAwesomeIcon icon={faBell} /></button>
                    </div>
                    ))}
                    </div>
                    <br />
                </span>
            ) : (
                <p style={{color:"red"}}>모든 학생이 투표를 완료했습니다.</p> 
            )}
            <button className="NonVotingModal-close-button" onClick={closeModalHandler}>닫기</button>
        </ReactModal>
    );
};

export default NonVotingModal;
