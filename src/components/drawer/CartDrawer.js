import React from "react";

const CartDrawer = ({ isOpen, onClose }) => {
  const cartItems = [
    { name: "Burger", price: 3.05 },
    { name: "Sandwich", price: 2.50 },
    { name: "Coke", price: 1.50 },
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
