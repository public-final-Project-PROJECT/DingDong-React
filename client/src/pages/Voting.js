import { useState, useEffect } from "react";
import NewVoting from "../component/NewVoting";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faTrashCan,faPause,faUsersSlash, faBell, faCircle, faPenToSquare,faUserCheck,faHourglassStart} from "@fortawesome/free-solid-svg-icons";
import '../asset/css/Voting.css';
import NonVotingModal from "../component/NonVotingModal";
import ReactModal from "react-modal";
import { useUserData } from "../hooks/useUserData";
import { useNavigate } from "react-router-dom";


const Voting = () => {
    const { selectedClassId } = useUserData();
    const [newVotingModal, setNewVotingModal] = useState(false);
    const [idVoteState, setIdVoteState] = useState(false);
    const [votingData, setVotingData] = useState([]); 
    const [contentsData, setContentsData] = useState({});
    const [modalShow, setModalShow] = useState(false);
    const [rere, setRere] = useState(false);
    const [voteResults, setVoteResults] = useState([{}]); 
    const [studentInfo, setStudentInfo] = useState({}); 
    const [nonStudentModalShow, setNonStudentModalShow] = useState(false); 
    const [isMaxVoted, setIdMaxVoted] = useState(); 
    const [nonVotingModal, setNonVotingModal] = useState(true);
    const [voteStudentsShow, setVoteStudentsShow] = useState(false); 
    const [activeContent, setActiveContent] = useState({});
    const [newStateValue, setNewStateValue] = useState(false);
    const [oneMoreState, setOneMoreState] = useState();
    const navigate = useNavigate();

    
    const findClassByStudentsName = async () => {
        try {
            const response = await axios.post(
                'http://localhost:3013/api/voting/findStudentsName',
                { classId: selectedClassId },
            );
           
            return response.data;
        } catch (error) {
            console.error('findStudentsName 중 error : ', error);
        }
    };


    const optionSend = async (voteId) => {
        try {
            const response = await axios.post(
                `http://localhost:3013/api/voting/VoteOptionUsers`,
                { votingId: voteId, classId: selectedClassId }
            );
            const voteDetails = response.data.reduce((acc, item) => {
                const { contentsId, studentId } = item;
                if (!acc[contentsId]) {
                    acc[contentsId] = { voters: [] };
                }
                acc[contentsId].voters.push(studentId);
                return acc;
            }, {});
            setVoteResults((prev) => ({
                ...prev,
                [voteId]: voteDetails,
            }));
        } catch (error) {
            console.error(`Error in optionSend for voting ID ${voteId}:`, error);
        }
    };

    const fetchInitialData = async () => {
        try {
            const votingResponse = await Send(); 
            if (votingResponse && votingResponse.length > 0) {
                const allContents = {};
                for (const vote of votingResponse) {
                    const contents = await contentsSend(vote.id); 
                    allContents[vote.id] = contents; 
                    await optionSend(vote.id); 
                }
                setContentsData(allContents); 
            }
    
            const studentData = await findClassByStudentsName();
            const studentMap = studentData.reduce((map, student) => {
                map[student.studentId] = {
                    id: student.studentId,
                    name: student.studentName,
                    img: student.studentImg,
                };
                return map;
            }, {});
            setStudentInfo(studentMap); 
        } catch (error) {
            console.error("fetchInitialData Error:", error);
        }
    };
    

    useEffect(() => {
        fetchInitialData();
    }, [idVoteState, newStateValue, modalShow]); 
    
    const handleVoteCreated = async () => {
        try {
            await fetchInitialData(); 
        } catch (error) {
            console.error("Error updating voting data:", error);
        }
    };


    const Send = async () => {
        try {
            const response = await axios.post(
                `http://localhost:3013/api/voting/findVoting`,
                { classId: selectedClassId }
            );
            
            setVotingData(response.data);
            return response.data;
        } catch (error) {
            console.error("Voting error:", error);
        }
    };


    const contentsSend = async (votingId) => {
        try {
            const response = await axios.post(
                `http://localhost:3013/api/voting/findContents`,
                { votingId: votingId }
            );
            return response.data;
        } catch (error) {
            console.error(`Error fetching contents for voting ID ${votingId}:`, error);
            return [];
            
        }
    };
    

    
    function endHandler(voteId){ 
      let result = window.confirm("투표를 종료하시겠습니까?");
      
      if(result){
      axios.post(
       `http://localhost:3013/api/voting/isVoteUpdate`,
         { votingId: voteId }, 
      ).then(function (response) {
          setIdVoteState(true);
          newStateValue? setNewStateValue(false) : setNewStateValue(true)
          alert("투표가 종료되었습니다 !");
      });
      }else{
        return;
      }

    }

    const findNonVoters = (votingId, totalStudents) => {
 
      const voteData = voteResults[votingId] || {};
  
      const voters = Object.keys(voteData).reduce((acc, contentsId) => {
        acc.push(...voteData[contentsId].voters);
        return acc;
      }, []);

      const nonVoters = totalStudents.filter(student => !voters.includes(student.id));
    
      return nonVoters;
    };

    
    const bellClickHandler = (voteId, isEnded) => {

        if(isEnded){
            alert("아직 진행중인 투표입니다. \n 종료 후에 알림을 보내주세요. ");
            return;
        }
        let result = window.confirm(
            `모든 학생들에게 투표 종료 알림이 갑니다. \n 보내시겠습니까 ?` 
        );

        if(result){
            axios.post(
                `http://localhost:3013/api/alert/votingResultAlert`,
                  { votingId: voteId , classId : selectedClassId}, 
               ).then(function (response) {
                if(response.data) {
                    alert("모든 학생에게 알림을 전송했습니다 !");
                }
        })
        }
    }


    const deleteHandler = (voteId) => {
        let result = window.confirm(
            `투표 기록이 사라집니다. 정말 삭제하시겠습니까 ?` 
        );
        if(result){

            axios.post(
                `http://localhost:3013/api/voting/deleteVoting`,
                  { votingId: voteId }, 
               ).then(function (response) {
                if(response.data) {
                    newStateValue? setNewStateValue(false) : setNewStateValue(true)
                }
                   alert("투표가 삭제되었습니다 !");
                
        })
            
        }
    }

    

    return (
        <div className="voting-total-container">
            <div className="voting-title-div">
                <h1 className="voting_title"> 학급 투표 <br/>
                </h1>
                <button className="voting_maker_icon" onClick={() => setNewVotingModal(true)}> <FontAwesomeIcon icon={faPenToSquare} /> </button>
            </div>

            {newVotingModal && <NewVoting setNewVotingModal={setNewVotingModal} newVotingModal={newVotingModal} />}

            {newVotingModal && (
                    <NewVoting
                        setNewVotingModal={setNewVotingModal}
                        newVotingModal={newVotingModal}
                        onVoteCreated={handleVoteCreated} 
                    />
                )}
                            {modalShow && (
                        <NewVoting
                            setModalShow={setModalShow}
                            modalShow={modalShow}
                            setRere={setRere}
                            rere={rere}
                            newStateValue={newStateValue}
                            setNewStateValue={setNewStateValue} 
                            onVoteCreated={handleVoteCreated}
                        />
                    )}
                            <div className="voting-container">
             {Array.isArray(votingData) &&
                votingData.map((vote) => {
                
                    const isEnded = !!vote.votingEnd; 
                    const today = new Date();
                    const endTime = new Date(vote.votingEnd);
                    const daysRemaining = Math.ceil((endTime - today) / (1000 * 60 * 60 * 24));
                    const nonVoters = findNonVoters(vote.id, Object.values(studentInfo)); 
                    const votedStudentIds = Object.keys(voteResults[vote.id] || {}).reduce((acc, contentsId) => {
                        acc.push(...voteResults[vote.id][contentsId].voters);
                        return acc;
                    }, []);

            return (
                <section key={vote.id} className="voting-card">
                    <div className="vote-status">
                        {!vote.vote ? (
                          <>
                          <div className="voting-ing-horizontal-container">
                            <h6  style={{ color: "grey" }}><FontAwesomeIcon icon={faCircle} /></h6>
                            <h3 className="voting-ing-gung" style={{ color: "grey" }}>종료</h3>
                          </div>
                            <button onClick={() => deleteHandler(vote.id)} className="votging-end-button">투표 삭제  <FontAwesomeIcon icon={faTrashCan} /></button>
                            {nonStudentModalShow && (
                            <NonVotingModal
                                setNonStudentModalShow={setNonStudentModalShow}
                                nonVoters={nonVoters}
                                voteId={vote.id}
                            />
                        )}
                           
                            </>
                        ) : (
                          <div className="voting-ing-horizontal-container">
                            <h6  style={{ color: "red" }}><FontAwesomeIcon icon={faCircle} /></h6>
                            <h3 className="voting-ing-gung">진행중</h3>
                            {nonStudentModalShow && (
                            <NonVotingModal
                                setNonStudentModalShow={setNonStudentModalShow}
                                nonVoters={nonVoters}
                                voteId={vote.id}
                            />
                        )}
                          </div>
                        )}
                         {vote.vote && !isEnded && (
                          <button className="end_voting_button" onClick={() => endHandler(vote.id)}> 투표 종료 <FontAwesomeIcon icon={faPause} />  </button>
                        )}
                        <div className="vote-name-container">
                            {isEnded && daysRemaining === 0 ? (
                                <p style={{ color: "red" }}><strong>오늘 마감되는 투표입니다 !</strong></p>
                            ) : (
                                isEnded && <h5 className="end-time">
                                      <FontAwesomeIcon icon={faHourglassStart} /> 종료일 :  {new Date(vote.votingEnd).toLocaleString()} 
                                   </h5>
                            )}
                        </div>
                    </div>

                    <div className="voting_button_div">
                    <button className="voting_two_button" onClick={() => setNonStudentModalShow(true)}><FontAwesomeIcon icon={faUsersSlash} /></button>
                    <button className="voting_two_button" onClick={() => bellClickHandler(vote.id, isEnded)}><FontAwesomeIcon icon={faBell} /></button>
                    </div>

                    <div className="voting-header">
                        <p className="voting-date-createdAt">
                            {new Date(vote.createdAt).toLocaleDateString()}{" "}
                        
                        </p>
                    </div>
                    <h2 className="vote-name">
                        {vote.votingName}
                    </h2>
                    <span className="vote-detail">{vote.votingDetail}</span>
                    <div className="separator"></div>
                    <ul className="voting_card_contents">
                    {Array.isArray(contentsData[vote.id]) && contentsData[vote.id].length > 0 ? (
                            contentsData[vote.id].map((content, idx) => {
                                const voters = voteResults[vote.id]?.[content.contentsId]?.voters || [];
    
                                const maxVotes = Math.max(
                                    ...contentsData[vote.id].map((c) => {
                                        const votersForContent = voteResults[vote.id]?.[c.contentsId]?.voters || [];
                                        return votersForContent.length;
                                    })
                                );
                                const isMaxVoted = voters.length === maxVotes;
                   
                                return (
                                    <div key={idx} className="vote-item">
                                        <div className ='contents_and_user_icons'>
                                        <p 
                                            className="vote-option" 
                                            style={{ color: isMaxVoted && voters.length != "0"? "red" : "black" }}
                                        >
                                            <FontAwesomeIcon icon={faCircleCheck} />   {content.votingContents} - {voters.length}명
                                        </p>
                                        <div className="student-voters">
                                            
                                                <button
                                                onClick={() =>
                                                    setActiveContent((prev) => ({
                                                    ...prev,
                                                    [vote.id]: prev[vote.id] === content.contentsId ? null : content.contentsId,
                                                    }))
                                                }
                                                className="voting_check_students"
                                                >
                                                <FontAwesomeIcon icon={faUserCheck} /> 
                                                </button>
                                                </div>

                                                {activeContent[vote.id] === content.contentsId && (
                                                <div className="student-voters-modal">

                                                    {voters.map((studentId) => {
                                                    const student = studentInfo[studentId];
                                                    return student ? (
                                                        <div key={studentId} className="student-info">
                                                        <img src={`http://112.221.66.174:6892${student.img}`} className="student-img" />
                                                        <span className="student-name">
                                                            {student.name}
                                                        </span>
                                                        </div>
                                                    ) : 
                                                   null
                                                    })}
                                                    
                                                </div>
                                                )}


                                        </div>
                                    </div>
                                    
                                );
                                
                            })
                        ) : (
                            <p>내용이 없습니다.</p>
                        )}

                    </ul>
                </section>
            );
        })}
</div>

</div>
    );
};


export default Voting;
