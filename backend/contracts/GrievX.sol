// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract GrievanceSystem {
    // Define roles
    address public adminGovt; // Government officer (owner)
    address public adminHead; // Municipal head

    // User data structure
    struct User {
        string name;
        string email;
        string dob;
        bool isRegistered;
        uint256 taxPaid;
        bool taxPaidStatus;
    }

    mapping(address => User) public users;
    address[] public registeredUsers;

    // Tax details
    // uint256 public fixedTaxAmount = 0.0000000000000001 ether; // Fixed tax amount in ETH
    // Set tax amount (only by Government Officer)

    uint256 public fixedTaxAmount;

    function setTaxAmount(uint256 _newAmount) public onlyAdminGovt {
        require(_newAmount > 0, "Tax amount must be greater than 0");
        fixedTaxAmount = _newAmount;
    }

    // Grievance data structure
    struct Grievance {
        string name;
        string details;
        string status; // PENDING, ACCEPTED, REJECTED
        address user;
        uint256 timestamp;
    }

    Grievance[] public grievances;

    // Project data structure
    struct Project {
        string pname;
        string details;
        uint256 fundsRequired;
        uint256 fundsAllocated;
        string status; // PLANNING, ONGOING, COMPLETED
        address adminHead;
        address projectManager;
        uint256[] relatedGrievances;
    }

    Project[] public projects;

    // Events
    event UserRegistered(address user, string name);
    event GrievanceFiled(address indexed user, uint256 grievanceId);
    event GrievanceStatusChanged(uint256 grievanceId, string status);
    event TaxPaid(address indexed user, uint256 amount);
    event ProjectCreated(
        uint256 projectId,
        string pname,
        uint256 fundsRequired
    );
    event ProjectFunded(uint256 projectId, uint256 amount);
    event ProjectStatusChanged(uint256 projectId, string status);
    event AdminHeadAssigned(address newAdminHead);

    // Constructor initializes the contract
    constructor() {
        adminGovt = msg.sender; // Set the deployer as AdminGovt
    }

    // Modifiers for restricting access
    modifier onlyAdminGovt() {
        require(
            msg.sender == adminGovt,
            "Only Government Officer can perform this action."
        );
        _;
    }

    modifier onlyAdminHead() {
        require(
            msg.sender == adminHead,
            "Only Municipal Head can perform this action."
        );
        _;
    }
    modifier onlyAdmin() {
        require(
            msg.sender == adminGovt || msg.sender == adminHead,
            "Only admin can perform this action"
        );
        _;
    }

    modifier onlyRegisteredUser() {
        require(
            users[msg.sender].isRegistered,
            "Only registered users can perform this action."
        );
        _;
    }

    // User Functions

    // Register a new user
    function registerUser(
        string memory _name,
        string memory _email,
        string memory _dob
    ) public {
        require(!users[msg.sender].isRegistered, "User already registered.");
        require(bytes(_name).length > 0, "Name cannot be empty.");

        users[msg.sender] = User({
            name: _name,
            email: _email,
            dob: _dob,
            isRegistered: true,
            taxPaid: 0,
            taxPaidStatus: false
        });

        registeredUsers.push(msg.sender);
        emit UserRegistered(msg.sender, _name);
    }

    // File a grievance
    function fileGrievance(string memory _details) public onlyRegisteredUser {
        require(bytes(_details).length > 0, "Details cannot be empty.");

        grievances.push(
            Grievance({
                name: users[msg.sender].name,
                details: _details,
                status: "PENDING",
                user: msg.sender,
                timestamp: block.timestamp
            })
        );

        emit GrievanceFiled(msg.sender, grievances.length - 1);
    }

    // Pay fixed tax to government
    function payTax() public payable onlyRegisteredUser {
        require(msg.value == fixedTaxAmount, "Incorrect tax amount.");
        require(
            !users[msg.sender].taxPaidStatus,
            "Tax already paid for current period."
        );

        users[msg.sender].taxPaid += msg.value;
        users[msg.sender].taxPaidStatus = true;

        emit TaxPaid(msg.sender, msg.value);
    }

    // View user's own grievances
    function viewMyGrievances()
        public
        view
        onlyRegisteredUser
        returns (Grievance[] memory)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < grievances.length; i++) {
            if (grievances[i].user == msg.sender) {
                count++;
            }
        }

        Grievance[] memory userGrievances = new Grievance[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < grievances.length; i++) {
            if (grievances[i].user == msg.sender) {
                userGrievances[index] = grievances[i];
                index++;
            }
        }

        return userGrievances;
    }

    // Update grievance status
    function updateGrievanceStatus(
        uint256 _grievanceId,
        string memory _status
    ) public onlyAdminHead {
        require(_grievanceId < grievances.length, "Invalid grievance ID.");
        require(
            keccak256(abi.encodePacked(_status)) ==
                keccak256(abi.encodePacked("ACCEPTED")) ||
                keccak256(abi.encodePacked(_status)) ==
                keccak256(abi.encodePacked("REJECTED")),
            "Invalid status"
        );

        grievances[_grievanceId].status = _status;
        emit GrievanceStatusChanged(_grievanceId, _status);
    }

    // Create a new project
    function createProject(
        string memory _pname,
        string memory _details,
        uint256 _fundsRequired,
        address _projectManager,
        uint256[] memory _relatedGrievances
    ) public onlyAdminHead {
        require(bytes(_pname).length > 0, "Project name cannot be empty.");
        require(
            _projectManager != address(0),
            "Invalid project manager address."
        );

        projects.push(
            Project({
                pname: _pname,
                details: _details,
                fundsRequired: _fundsRequired,
                fundsAllocated: 0,
                status: "PLANNING",
                adminHead: msg.sender,
                projectManager: _projectManager,
                relatedGrievances: _relatedGrievances
            })
        );

        emit ProjectCreated(projects.length - 1, _pname, _fundsRequired);
    }

    // Mark project as completed
    function completeProject(uint256 _projectId) public onlyAdminHead {
        require(_projectId < projects.length, "Invalid project ID.");
        require(
            keccak256(abi.encodePacked(projects[_projectId].status)) ==
                keccak256(abi.encodePacked("ONGOING")),
            "Project must be ongoing to complete"
        );

        projects[_projectId].status = "COMPLETED";
        emit ProjectStatusChanged(_projectId, "COMPLETED");
    }

    // View all grievances
    function viewAllGrievances()
        public
        view
        onlyAdmin
        returns (Grievance[] memory)
    {
        return grievances;
    }

    // View tax payment status of all users
    function viewTaxPayments()
        public
        view
        onlyAdmin
        returns (address[] memory, uint256[] memory, bool[] memory)
    {
        address[] memory userAddresses = new address[](registeredUsers.length);
        uint256[] memory amountsPaid = new uint256[](registeredUsers.length);
        bool[] memory paidStatuses = new bool[](registeredUsers.length);

        for (uint256 i = 0; i < registeredUsers.length; i++) {
            userAddresses[i] = registeredUsers[i];
            amountsPaid[i] = users[registeredUsers[i]].taxPaid;
            paidStatuses[i] = users[registeredUsers[i]].taxPaidStatus;
        }

        return (userAddresses, amountsPaid, paidStatuses);
    }

    // AdminGovt Functions

    // Assign new municipal head
    function assignAdminHead(address _newAdminHead) public onlyAdminGovt {
        require(_newAdminHead != address(0), "Invalid address");
        adminHead = _newAdminHead;
        emit AdminHeadAssigned(_newAdminHead);
    }

    // Fund a project (send ETH to project manager) from contract balance manually
    function fundProject(
        uint256 _projectId,
        uint256 _amount
    ) public onlyAdminGovt {
        require(_projectId < projects.length, "Invalid project ID.");
        Project storage project = projects[_projectId];

        require(
            keccak256(abi.encodePacked(project.status)) ==
                keccak256(abi.encodePacked("PLANNING")),
            "Project must be in planning stage"
        );

        require(_amount > 0, "Amount must be greater than 0");
        require(
            _amount <= project.fundsRequired - project.fundsAllocated,
            "Exceeds required funds"
        );
        require(
            address(this).balance >= _amount,
            "Insufficient contract balance"
        );

        project.fundsAllocated += _amount;
        if (project.fundsAllocated >= project.fundsRequired) {
            project.status = "ONGOING";
        }

        (bool sent, ) = project.projectManager.call{value: _amount}("");
        require(sent, "Failed to send ETH to project manager");

        emit ProjectFunded(_projectId, _amount);
        emit ProjectStatusChanged(_projectId, project.status);
    }

    // View all users
    function viewAllUsers() public view onlyAdmin returns (User[] memory) {
        User[] memory allUsers = new User[](registeredUsers.length);
        for (uint256 i = 0; i < registeredUsers.length; i++) {
            allUsers[i] = users[registeredUsers[i]];
        }
        return allUsers;
    }

    // View contract balance (for government officer)
    function getContractBalance() public view onlyAdminGovt returns (uint256) {
        return address(this).balance;
    }

    // Withdraw contract funds (only government officer)
    function withdrawFunds(uint256 _amount) public onlyAdminGovt {
        require(_amount <= address(this).balance, "Insufficient balance");
        (bool sent, ) = adminGovt.call{value: _amount}("");
        require(sent, "Failed to withdraw ETH");
    }

    // Helper function to compare strings
    function compareStrings(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}
