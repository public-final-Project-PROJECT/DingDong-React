
import { useState } from "react";
import NewVoting from "../component/NewVoting";



const Voting = () => {

    const [newVotingModal, setNewVotingModal] = useState(false); // 투표 만들기 모달

    return (
        <>
        <h1> 투표 </h1>
        <button onClick={()=> setNewVotingModal(true)}> + 새 투표 </button>
        {newVotingModal && <NewVoting setNewVotingModal={setNewVotingModal} newVotingModal={newVotingModal}/>}
        </>

    )
}
export default Voting;