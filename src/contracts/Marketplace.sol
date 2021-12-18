pragma solidity ^0.5.0;

contract Marketplace {
  string public name;
  uint public productCount=0;
  mapping(uint => Product) public products;
  address payable ownerAdderss = 0x1606cE047B38d5b3d714Db5728E7827b9E0D5AF4;

struct Product {
  uint id;
  string name;
  uint price;
  address payable owner;
  bool forSale;
}

event ProductCreated (
  uint id,
  string name,
  uint price,
  address payable owner,
  bool forSale
);

event ProductPurchased (
  uint id,
  string name,
  uint price,
  address payable owner,
  bool forSale
);

event ProductUpdated (
  uint id,
  string name,
  uint price,
  address payable owner,
  bool forSale
);

  constructor() public {
    name = "Dapp University Marketplace";
  }

  function createProduct(string memory _name, uint _price) public {
    //Require a name
    require(bytes(_name).length > 0, "Enter a valid name");
    //Requiere a valid price
    require(_price > 0, "Enter a valid price");
    //Increment product count
    productCount++;
    //Create the product
    products[productCount] = Product(productCount, _name, _price, msg.sender, false);
    //Trigger an event
    emit ProductCreated(productCount, _name, _price, msg.sender, true);
  }

  function changePrice(uint _id, uint _price) public {
    //Requiere a valid price
    require(_price > 0, "Enter a valid price");
    //Make sure the product has valid id
    require(_id > 0 && _id <= productCount, "Enter valid id");
    //Changes product price
    Product memory _product = products[_id];
    _product.price = _price;
    products[_id] = _product;
    //Trigger an event
    emit ProductUpdated(_id, products[_id].name, products[_id].price, msg.sender, products[_id].forSale);
  }

  function changeForSalestate(uint _id, bool forSale) public {
    //Make sure the product has valid id
    require(_id > 0 && _id <= productCount, "Enter valid id");
    //Changes product for sale flag
    Product memory _product = products[_id];
    _product.forSale = forSale;
    products[_id] = _product;
    //Trigger an event
    emit ProductUpdated(_id, products[_id].name, products[_id].price, msg.sender, products[_id].forSale);
  }

  function purchaseProduct(uint _id) public payable {
    //Fetch the product and make a copy of it
    Product memory _product = products[_id];
    //Fetch the owner
    address payable _seller = _product.owner;
    //Make sure the product has valid id
    require(_product.id > 0 && _product.id <= productCount, "Enter valid id");
    //Require that there is enough Ether in the transaction
    require(msg.value >= _product.price,"Transfer the correct amount");
    //Require that the product is for sale
    require(_product.forSale, "Product not for sale");
    //Require that the buyer is not the seller
    require(msg.sender != _seller, "Buyer cannot be seller");
    //Transfer ownership to the buyer
    _product.owner = msg.sender;
    //Update the product
    products[_id] = _product;
    //Sends 5% for platform owner
    ownerAdderss.transfer((msg.value*5)/100);
    //Pay the seller by sending them Ether (95% of price)
    address(_seller).transfer((msg.value*95)/100);
    //Trigger an event
    emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, products[_id].forSale);
  }
}