import './OrderList.css';
import OrderListItem from '../OrderListItem/OrderListItem';
// import LineItem from '../LineItem/LineItem';

export default function OrderList({orders}){
    const ordersList = orders.map(item =>
        <OrderListItem
        key={item._id}
        orderItem={item}
        />
    );
    return(
        <main className="">
            {ordersList}
        </main>
    );
}   