// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Orderbook {
    struct Order {
        address user;
        uint256 quantity;
    }

    uint256 public flatRate; // Fixed price per unit

    Order[] public buyOrders;
    Order[] public sellOrders;

    event BuyOrderPlaced(address indexed buyer, uint256 quantity);
    event SellOrderPlaced(address indexed seller, uint256 quantity);
    event OrderMatched(address indexed buyer, address indexed seller, uint256 quantity);

    constructor(uint256 _flatRate) {
        flatRate = _flatRate; // Set the fixed price for each unit traded
    }

    function placeBuyOrder(uint256 _quantity) external payable {
        require(msg.value == _quantity * flatRate, "Incorrect payment amount");
        buyOrders.push(Order(msg.sender, _quantity));
        emit BuyOrderPlaced(msg.sender, _quantity);
        matchOrders();
    }

    function placeSellOrder(uint256 _quantity) external {
        sellOrders.push(Order(msg.sender, _quantity));
        emit SellOrderPlaced(msg.sender, _quantity);
        matchOrders();
    }

    function matchOrders() internal {
        uint256 sellIndex = 0;
        uint256 buyIndex = 0;

        while (sellIndex < sellOrders.length && buyIndex < buyOrders.length) {
            Order storage sellOrder = sellOrders[sellIndex];
            Order storage buyOrder = buyOrders[buyIndex];

            if (sellOrder.quantity <= buyOrder.quantity) {
                payable(sellOrder.user).transfer(sellOrder.quantity * flatRate);
                buyOrder.quantity -= sellOrder.quantity;
                emit OrderMatched(buyOrder.user, sellOrder.user, sellOrder.quantity);
                delete sellOrders[sellIndex];
                sellIndex++;
            } else {
                payable(sellOrder.user).transfer(buyOrder.quantity * flatRate);
                sellOrder.quantity -= buyOrder.quantity;
                emit OrderMatched(buyOrder.user, sellOrder.user, buyOrder.quantity);
                delete buyOrders[buyIndex];
                buyIndex++;
            }
        }
    }

    function getBuyOrders() external view returns (Order[] memory) {
        return buyOrders;
    }

    function getSellOrders() external view returns (Order[] memory) {
        return sellOrders;
    }
}
