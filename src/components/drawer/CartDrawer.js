import React from "react";

const CartDrawer = ({ isOpen, onClose }) => {
  const cartItems = [
    { name: "Item 1", price: 10.0 },
    { name: "Item 2", price: 20.0 },
    { name: "Item 3", price: 30.0 },
  ];

  return (
    <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
      <button className="close-button" onClick={onClose}>
        X
      </button>
      <h2>Cart</h2>
      <ul className="cart-items">
        {cartItems.map((item) => (
          <li key={item.name}>
            {item.name} - ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartDrawer;
