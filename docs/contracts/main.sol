// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract UserBoundNFT is ERC1155, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    Counters.Counter private _tokenIdCounter; 

    struct ListedCredit {
       uint256 price;
       uint256 totalPrice;
       uint256 units;
       address seller;
    }
 
    mapping(uint256 => string) private _uris; 
    mapping(uint256=>ListedCredit) private _listings;
    uint256  private listId=0;
    address private admin;

    // use graphQL for fetching and indexing
    event Listed(uint256 indexed  listId , uint256 indexed  units , uint256 indexed  price , uint256 totalPrice); 
    event Purchased(uint256 indexed  listId );

 
    constructor() ERC1155("https://ipfs.io/ipfs/bafkreiar442uwfrvmtj453xxb6gdedae7xm4tpcanynulwhb2la7bxnerm") {
        admin = msg.sender;
    }

    // Override supportsInterface to resolve ambiguity
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        require(bytes(_uris[tokenId]).length > 0, "URI not set for this token");
        return _uris[tokenId];
    }

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values) 
    internal override {
        require(from==address(0) || to==address(0) , "Soul-Bound NFT");
        super._update(from, to, ids, values);
    }

    function registerBusiness( string memory tokenUri ) external  returns (uint256){
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(msg.sender, tokenId, 1, "");
        _uris[tokenId] = tokenUri;

        return tokenId; 
    }

    function verifyBusiness( uint256 tokenId) external view returns (string memory) {
        require(msg.sender != address(0), "Invalid wallet address"); 
        require(balanceOf(msg.sender, tokenId) > 0 , "No NFT found");
        string memory tokenUri = uri(tokenId);
        return (tokenUri);
    }

    function updateUri(uint256 tokenId, string memory newUri) external { 
        require(balanceOf(msg.sender, tokenId) > 0 , "No NFT found");
        _uris[tokenId] = newUri;
    }


    function list(uint256 _price , uint256 _units , uint256 _totalPrice) external  {
       require(_units > 0 , "Cannot sell Zero Credits");
       require(_price > 0 , "Cannot Sell for free");
       listId++;
       ListedCredit storage listing = _listings[listId];
       listing.price = _price;
       listing.totalPrice = _totalPrice;
       listing.units = _units;
       listing.seller = msg.sender;
       emit Listed(listId , _units , _price , _totalPrice);
    }

    function purchase(uint256 _listId) external payable {
        require(_listId<=listId , "Invalid listId");
        require(_listings[_listId].units!=0 , "Already Sold");
        ListedCredit memory listing = _listings[_listId];
        require(msg.value >= listing.totalPrice , "Insufficient Ethers");

        uint256 adminFee = (listing.totalPrice * 1) / 10000;
        uint256 sellerAmount = listing.totalPrice - adminFee;

        (bool sentToAdmin, ) = admin.call{value: adminFee}("");
        require(sentToAdmin, "Failed to send admin fee");

        address seller = listing.seller;
        address buyer  = msg.sender; 
        uint256 excess = msg.value - listing.totalPrice;
        (bool sentToSeller,) = seller.call{value:sellerAmount}("");
        require(sentToSeller, "Failed to send Ether to seller");

        if (excess > 0) {
            (bool refundedToBuyer,) = buyer.call{value: excess}("");
            require(refundedToBuyer, "Failed to refund excess Ether to buyer");
        }

        _listings[_listId].units = 0;
        emit Purchased(listId);
    }
}