import { useState, useEffect } from "react";
import ReactModal from "react-modal";
import '../asset/css/NonVotingModal.css';
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

     const votingNonStudentAlert = async (studentId) => {
         console.log(studentId);

    //     try {
    //         const response = await axios.post(
    //           `http://localhost:3013/api/voting/newvoting`,
    //           {
    //             classId: selectedClassId,  // 학급 id
    //             votingName: title, // 제목
    //             detail: detail, // 설명
    //             votingEnd:votingEnd? votingEnd : null, // 마감일자
    //             contents: arr, // 투표 항목들 
    //             anonymousVote: anonymousVote,  // 비밀 투표 여부
    //             doubleVote: doubleVote // 중복 투표 가능 여부 
    //           },
       
    //         );
    //         return response;
            
    //       } catch (error) {
    //         console.error("투표 생성 api error:", error.response || error.message);
    //       }

         }


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
                    borderRadius: "5px",
                    border: "none",
                    padding: "42px",
                    fontSize: "16px",
                    boxShadow: "1px 1px 1px 2px #ccc"
                },
            }}
        >
            {nonVoters.length > 0 ? (
                <span className="non-voters">
                    <strong className="nonVoting-title">[ 미투표 학생 ]</strong><br/><br/>
                    <h4 className="non-voting-modal-title" style={{color:"red"}}> 투표 알림을 보낼 학생을 선택해주세요</h4><hr/>
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
