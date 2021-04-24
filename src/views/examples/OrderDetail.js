import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Headers/Header';
import { useRouteMatch } from 'react-router';
import { Card, Col, Container, Row } from 'reactstrap';
import { useEffect } from 'react';
import db from 'firebase/firebase.config';
import { useState } from 'react';

OrderDetail.propTypes = {

};

function OrderDetail(props) {
    const match = useRouteMatch()
    const [order, setOrder] = useState({})

    useEffect(() => {
        const orderid = match.params.id
        db.collection('Orders').doc(orderid).get().then((orderDoc) => {
            const { items, userid, orderTime, deliverTime, status, address, phone, receiver } = orderDoc.data()

            const itemsPromise = items.map((item) => {
                // get item title, image
                return db.collection('Products').doc(item.productid).get().then((productDoc) => (
                    {
                        title: productDoc.data().title,
                        img: productDoc.data().img,
                        price: item.price,
                        quantity: item.quantity,
                        productid: productDoc.id,
                    }
                )).catch((error) => {
                    console.log("Get items error: ", error)
                })
            })

            // set order
            return Promise.all(itemsPromise).then((newItems) => {
                // get user
                db.collection('Users').doc(userid).get().then((userDoc) => {
                    const newOrder = {
                        // order info
                        orderid: orderDoc.id,
                        orderTime: orderTime,
                        deliverTime: deliverTime,
                        status: status,
                        items: newItems,
                        // receiver info
                        receiver: receiver,
                        receiverAddress: address,
                        receiverPhone: phone,
                        // orderer info
                        orderer: userDoc.data().displayName,
                        ordererEmail: userDoc.data().email,
                        ordererPhone: userDoc.data().phone,
                    }
                    console.log("Order: ", newOrder)
                    setOrder(newOrder)
                }).catch((error) => {
                    console.log('Get usser error: ', error)
                })
            })
        }).catch((error) => {
            console.log('Load order error: ', error)
        })

    }, [])

    return (
        <div className='order-detail'>
            <Header />
            <Container className='mt--7' fluid>
                <Row>
                    <Col>
                        <Card className='shadow'>
                            <Container fluid>
                                <Row>
                                    <Col>
                                        <div>Orderer: {order.orderer}</div>
                                        <div>Email: {order.ordererEmail}</div>
                                        <div>Phone: {order.ordererPhone}</div>
                                    </Col>
                                    <Col>
                                        <div>Receiver: {order.receiver}</div>
                                        <div>Address: {order.receiverAddress}</div>
                                        <div>Phone: {order.receiverPhone}</div>
                                    </Col>
                                </Row>
                                {order.items.map((item) => (
                                    <Row>
                                        <div>Product ID: {item.productid}</div>
                                        <div>Title: {item.title}</div>
                                        <div><img src={item.img} alt={item.title} /></div>
                                        <div>Price: {item.price}</div>
                                        <div>Quantity: {item.quantity}</div>
                                    </Row>

                                ))}
                            </Container>
                        </Card>
                    </Col>
                </Row>

            </Container>

        </div>
    );
}

export default OrderDetail;