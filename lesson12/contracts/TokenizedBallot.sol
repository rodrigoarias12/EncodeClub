
pragma solidity >=0.7.0 <0.9.0;
import "./ERC20Votes.sol";

contract Ballot {
    MyToken public voteToken;
    uint256 targetBlockNumber:
    struct Proposal {
        bytes32 name;   
        uint voteCount; 
    }    
    mapping (address => uint256) spentVotePower;
    Proposal[] public proposals;
    constructor(bytes32[] memory proposalNames, address _voteToken, uint256 _targetblocknumber ) {
        voteToken = MyToken(_voteToken);
        targetBlockNumber = _targetblocknumber;
    
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    function vote(uint proposal, uint amount ) external {
    
      //require amount < = amountICanVote
      require(votePower[msg.sender] >= amount, "You don't have enough vote power");
      proposal[proposal].voteCount+=amount;
      //increse the spent votepower for that account
      spentVotePower[msg.sender] += amount;

    }
    function votePower(address voter) public view returns (uint256) {
        //return amountICanVote
        //calling another contract to getpastvotes - spent votepower for that account 
       return voteToken.getPastVotes(voter, targetBlockNumber) - spentVotePower[voter];
    }

    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }
 
    function winnerName() external view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}