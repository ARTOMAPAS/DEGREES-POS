// ItemCard.js
import React from 'react';

const ItemCard = ({ item, onSelect }) => {
  return (
    <div className="item-card" onClick={onSelect}>
      {item.itemImage && (
        <img
          className="item-card-img"
          src={item.itemImage.startsWith('/itemuploads/') ? `${process.env.REACT_APP_SERVER_URL}${item.itemImage}` : item.itemImage}
          alt={item.item_name}
        />
      )}
      <div className="item-info">
        <div><u>View Details →</u></div>
      </div>
    </div>
  );
};

export default ItemCard;
