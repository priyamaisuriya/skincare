import { OrderItems } from "./order-items";
export interface Order {
    id: number;
    customer_id: number;
    order_date: string;
    status: string;
    payment_id: number;
    shipping_id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    customer_city: string;
    customer_state: string;
    customer_postal_code: string;
    customer_country: string;
    quantity: number;
    total_amount: number;
    discount: number;
    sub_amount: number;
    shipping_amount: number;
    delivery_charge: number;
    source: string;
    courier_id: number;
    tracking_id: string;
    est_delivery_date: string;
    delivery_date: string;
    items: OrderItems[];
}
