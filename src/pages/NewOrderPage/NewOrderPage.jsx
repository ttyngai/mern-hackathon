import { useState, useEffect, useRef } from 'react';
import * as itemsAPI from '../../utilities/items-api';

export default function NewOrderPage() {
  const [menuItems, setMenuItems] = useState([]);
  const categoriesRef = useRef([]);

  useEffect(function() {
    async function getItems() {
      const items = await itemsAPI.getAll();
      categoriesRef.current = items.reduce((acc, item) => {
        const catName = item.category.name;
        return acc.includes(catName) ? acc : [...acc, catName];
      }, []);
      setMenuItems(items);
    }
    getItems();
  }, []);

  return (
    <>
      <h1>NewOrderPage</h1>
      <button onClick={() => setMenuItems(Date.now())}>Trigger Re-Render</button>
    </>
  );
}