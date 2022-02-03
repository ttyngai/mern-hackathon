import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './OrderHistoryPage.css';
import Logo from '../../components/Logo/Logo';
import UserLogOut from '../../components/UserLogOut/UserLogOut';
import * as ordersAPI from '../../utilities/orders-api';
import * as itemsAPI from '../../utilities/items-api';
import OrderList from '../../components/OrderList/OrderList';


export default function OrderHistoryPage({ user, setUser }) {
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState('');

  useEffect(function(){
    async function getOrdersHistory(){
      const orders = await ordersAPI.getOrders();
      setOrders(orders);
      setActiveOrder(orders[0])
    }
    getOrdersHistory();
  });

  return (
    <main className="OrderHistoryPage">
      <aside>
        <Logo />
        <Link to="/orders/new" className="button btn-sm">NEW ORDER</Link>
        <UserLogOut user={user} setUser={setUser} />
      </aside>
      <OrderList orders={orders}/>

    </main>
  );
}