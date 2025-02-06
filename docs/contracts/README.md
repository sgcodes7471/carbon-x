# Outline of the Main Smart Contract
#### This contract is an ERC1155-based Soul-Bound NFT system used for business verification and carbon credit trading, ensuring non-transferable ownership and secure transactions. 

## 1. Variables Used

### State Variables:
- **ADMIN_ROLE**: A constant `bytes32` hash representing the admin role.
- **_tokenIdCounter**: A counter to track the `tokenId` of minted NFTs.
- **_uris**: A mapping storing URIs for each token ID.
- **_listings**: A mapping storing details of listed credits.
- **listId**: A counter for tracking listings.
- **admin**: Stores the address of the contract deployer (admin).

### Structs:
#### ListedCredit
- **price**: Price per unit.
- **totalPrice**: Total price of the listed credits.
- **units**: Number of units available.
- **seller**: Address of the seller.

## 2. ERC1155 Token Details

- The contract inherits from ERC1155 (multi-token standard).
- **Soul-Bound Mechanism**:
  - `_update` function prevents transfers between users (NFTs are bound to the original minter).
- **Metadata Storage**:
  - `_uris` mapping stores token URIs.
- **Token minting**:
  - `_mint` function mints NFTs for businesses.

## 3. Events Emitted
#### The Events emitted are consistently listened by the Subgraphs deployed on The Graph Protocol
- **ListedCredits**: Emitted when a user lists credits for sale.
- **PurchasedCredits**: Emitted when a purchase is completed.

## 4. Functions

### Core ERC1155 Overrides

- **supportsInterface**: Resolves conflicts between ERC1155 and AccessControl.
- **uri**: Returns the metadata URI of a token.

### Business Registration & Verification

- **registerBusiness**:
  - Mints a soul-bound NFT representing a business.
  - Stores metadata including business name, sector, country, and year of establishment.
- **verifyBusiness**:
  - Checks if a caller owns a specific NFT.
  - Returns the associated metadata URI.
- **updateUri**:
  - Allows an admin to update a token's URI.

### Credit Listing & Purchase

- **list**:
  - Allows users to list credits for sale by specifying price, units, and total price.
- **purchase**:
  - Allows buyers to purchase listed credits.
  - Ensures sufficient payment, deducts admin fees (0.01% of `totalPrice`), and transfers remaining funds to the seller.
  - Refunds any excess Ether to the buyer.
  - Marks the listing as sold.

# IoT Credit Management Contract

This contract manages the credit values associated with IoT devices. It stores credit values in a private mapping and provides functions to retrieve and update these values.

## Variables

### `iot (Mapping)`
- **Type**: `mapping(string => uint256[])`
- **Description**: This private mapping stores the relationship between a unique string identifier (e.g., device or sensor ID) and an array of corresponding credit values (represented as `uint256[]`).

## Functions

### `getByIdentifier`
- **Parameters**: 
    - `_identifier (string memory)`: The identifier (e.g., device ID) used to look up the stored credit values.
- **Return**: 
    - Returns an array of credit values associated with the provided identifier, of type `uint256[]`.
- **Description**: 
    - This external view function allows retrieval of the credit values associated with a given identifier from the `iot` mapping.

### `updateCredits`
- **Parameters**: 
    - `_credits (uint256)`: The new credit value to be appended for the specified identifier.
    - `_identifier (string memory)`: The identifier whose credit values need to be updated.
- **Description**: 
    - This external function appends a new credit value for the specified identifier.
    - **Requirements**: 
        - The identifier should already exist in the `iot` mapping (i.e., it should have at least one stored credit value).
        - The action must not result in a redundant update where the last stored credit value and the new credit value are the same.
- **Error Messages**:
    - `"Invalid Identifier"`: Thrown if the identifier doesn't exist (i.e., it has no associated values).
    - `"Redundant action"`: Thrown if the provided credit value equals the last stored value, indicating no update is needed.

### `initializeIdentifier`
- **Parameters**:
    - `_identifier (string memory)`: The unique identifier for the IoT device.
    - `_initialCredit (uint256)`: The initial credit value to be stored.
- **Description**:
    - This external function initializes a new identifier with an initial credit value.
    - **Requirements**:
        - The identifier must not already exist in the mapping.
- **Error Messages**:
    - `"Identifier already exists"`: Thrown if the identifier is already present in the mapping.

# Orderbook Smart Contract

This contract implements a order book mechanism for buying and selling assets at a **fixed price**.
This contract is currently not implemented as it is very gas intensive, but moving to layer 2 network such arbitrum network could mitigate this issue. 

## Variables

### `flatRate`
- **Type**: `uint256`
- **Description**: This public variable represents the fixed price per unit of the traded asset.

### `buyOrders`
- **Type**: `Order[]`
- **Description**: An array that stores all **buy orders**, containing the user address and quantity.

### `sellOrders`
- **Type**: `Order[]`
- **Description**: An array that stores all **sell orders**, containing the user address and quantity.

## Structs

### `Order`
- **Fields**:
  - `user (address)`: The Ethereum address of the buyer or seller.
  - `quantity (uint256)`: The quantity of the asset requested in the order.
- **Description**: This struct represents a single order in the system.

## Events

### `BuyOrderPlaced`
- **Parameters**:
  - `buyer (address)`: The address of the user who placed the buy order.
  - `quantity (uint256)`: The number of units ordered.
- **Description**: This event is emitted when a new buy order is placed.

### `SellOrderPlaced`
- **Parameters**:
  - `seller (address)`: The address of the user who placed the sell order.
  - `quantity (uint256)`: The number of units being sold.
- **Description**: This event is emitted when a new sell order is placed.

### `OrderMatched`
- **Parameters**:
  - `buyer (address)`: The address of the buyer whose order is matched.
  - `seller (address)`: The address of the seller whose order is matched.
  - `quantity (uint256)`: The number of units that were matched in the trade.
- **Description**: This event is emitted when a **buy** and **sell** order are matched.

## Functions

### `placeBuyOrder`
- **Parameters**:
  - `_quantity (uint256)`: The number of units the buyer wants to purchase.
- **Description**:
  - This external payable function allows users to place buy orders.
  - The transaction must include **ETH equivalent** to `_quantity * flatRate`.
  - The function stores the buy order and calls `matchOrders()` to process potential matches.
- **Error Messages**:
  - `"Incorrect payment amount"`: Thrown when the sent ETH does not match `_quantity * flatRate`.

### `placeSellOrder`
- **Parameters**:
  - `_quantity (uint256)`: The number of units the seller wants to sell.
- **Description**:
  - This external function allows users to place **sell orders**.
  - No ETH is required for placing a sell order.
  - The function stores the sell order and calls `matchOrders()` to attempt matching.

### `matchOrders`
- **Description**:
  - This internal function attempts to **match buy and sell orders** in a FIFO (First-In, First-Out) manner.
  - If a match is found:
    - The seller receives ETH equivalent to the sold quantity (`quantity * flatRate`).
    - The order quantities are updated accordingly.
  - If an order is fully matched, it is removed from storage.
- **Process**:
  1. Check if a **buy order** and **sell order** exist.
  2. Compare the quantities:
    - If the **sell order's quantity** is less than or equal to the **buy order's quantity**, transfer ETH to the seller and update the buy order.
    - If the **buy order's quantity** is less than the **sell order's quantity**, transfer ETH to the seller and update the sell order.
  3. Emit the `OrderMatched` event.
- **Error Handling**:
  - Orders are automatically removed once fulfilled.

### `getBuyOrders`
- **Return**:
  - Returns an array of `Order` structs representing **all active buy orders**.
- **Description**:
  - This external **view** function allows users to fetch the list of buy orders.

### `getSellOrders`
- **Return**:
  - Returns an array of `Order` structs representing **all active sell orders**.
- **Description**:
  - This external **view** function allows users to fetch the list of sell orders.

