
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ContractAnalyzer {
    struct Analysis {
        address contractAddress;
        string analysis;
        address analyzer;
        uint256 timestamp;
        string analysisType;
        string jurisdiction;
    }
    
    // Mapping from contract address to array of analysis IDs
    mapping(address => uint256[]) public contractToAnalyses;
    
    // Array to store all analyses
    Analysis[] public analyses;
    
    // Events
    event AnalysisAdded(address indexed contractAddress, uint256 indexed analysisId, address indexed analyzer);
    event AnalysisUpdated(address indexed contractAddress, uint256 indexed analysisId);
    
    function addAnalysis(
        address _contractAddress,
        string memory _analysis,
        string memory _analysisType,
        string memory _jurisdiction
    ) public returns (uint256) {
        Analysis memory newAnalysis = Analysis({
            contractAddress: _contractAddress,
            analysis: _analysis,
            analyzer: msg.sender,
            timestamp: block.timestamp,
            analysisType: _analysisType,
            jurisdiction: _jurisdiction
        });
        
        uint256 analysisId = analyses.length;
        analyses.push(newAnalysis);
        contractToAnalyses[_contractAddress].push(analysisId);
        
        emit AnalysisAdded(_contractAddress, analysisId, msg.sender);
        
        return analysisId;
    }
    
    function getAnalysis(uint256 _analysisId) public view returns (
        address contractAddress,
        string memory analysis,
        address analyzer,
        uint256 timestamp,
        string memory analysisType,
        string memory jurisdiction
    ) {
        require(_analysisId < analyses.length, "Analysis does not exist");
        Analysis memory a = analyses[_analysisId];
        return (
            a.contractAddress,
            a.analysis,
            a.analyzer,
            a.timestamp,
            a.analysisType,
            a.jurisdiction
        );
    }
    
    function getAnalysesForContract(address _contractAddress) public view returns (uint256[] memory) {
        return contractToAnalyses[_contractAddress];
    }
    
    function getAnalysisCount() public view returns (uint256) {
        return analyses.length;
    }
}
