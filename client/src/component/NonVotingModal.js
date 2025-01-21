import { useState, useEffect } from "react";
import ReactModal from "react-modal";
import '../asset/css/NonVotingModal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useUserData } from "../hooks/useUserData";

const NonVotingModal = ({ setNonStudentModalShow, nonVoters, voteId }) => {
    const [nonVotingModal, setNonVotingModal] = useState(true); // 모달 on/off
    const { selectedClassId } = useUserData();

    const closeModalHandler = () => {
        setNonStudentModalShow(false);
        setNonVotingModal(false);
        console.log(nonVoters)
        console.log(voteId)
        // console.log(filteredNonVoters)
    };


    // const filteredNonVoters = nonVoters.filter(student => 
    //     !votedStudentIds.includes(student.studentId) 
    // );

    // console.log(filteredNonVoters); 

     const votingNonStudentAlert = async (studentId, voteId) => {

        console.log(voteId);
        try {
            const response = await axios.post(
              `http://localhost:3013/api/alert/votingUserAlertSave`,
              {
                classId: selectedClassId,  // 학급 id
                studentId : studentId,
                votingId : voteId
              },
       
            );
            console.log(response.data);
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
            appElement={document.getElementById("root")}
        >
            {nonVoters.length > 0 ? (
                <span className="non-voters">
                    <strong className="nonVoting-title">[ 미투표 학생 ]</strong><br/><br/>
                    <h4 className="non-voting-modal-title"> 투표 알림을 보낼 학생을 선택해주세요</h4><hr/>
                    {console.log(nonVoters)}
                    <div className="non-voting-students-grid">
                    {nonVoters.map(student => (
                    <div key={student.id} className="student-info-row">
                        <div className="student-info-row">{student.name}</div>
                        <button className="bell_icon" onClick={() => votingNonStudentAlert(student.id)}><FontAwesomeIcon icon={faBell} /></button>
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
