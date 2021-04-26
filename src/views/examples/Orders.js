/*!

=========================================================
* Argon Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { useState } from "react";
import { useEffect } from "react";
import db from "firebase/firebase.config";
import ChangeStatusModal from "components/ChangeStatusModal/ChangeStatusModal";
import { FaCircle } from 'react-icons/fa';
import { useHistory, useRouteMatch } from "react-router";
import Filter from "components/Filter/FIlter";


const Orders = (props) => {
  const [orderList, setOrderList] = useState([])
  const match = useRouteMatch()
  const history = useHistory()

  const [statusFilter, setStatusFilter] = useState('All')
  const [timeFilter, setTimeFilter] = useState('Last 15 orders')
  // const [currentOrderList, setCurrentOrderList] = useState([])

  useEffect(() => {
    const limit = extractLimit(timeFilter)

    const statusFilterOrderRef = statusFilter === 'All'
      ? db.collection('Orders').orderBy('orderTime', 'desc')
      : db.collection('Orders').where('status', '==', statusFilter).orderBy('orderTime', 'desc')

    const orderRef = limit === Infinity ? statusFilterOrderRef : statusFilterOrderRef.limit(limit)

    orderRef.get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const orderListPromise = querySnapshot.docs.map((orderDoc) => (
          { ...orderDoc.data(), id: orderDoc.id }
        ))

        Promise.all(orderListPromise).then(newOrderList => {
          console.log("Order List: ", newOrderList)
          setOrderList(newOrderList)
        })
      }
    })
  }, [statusFilter, timeFilter])

  // useEffect(() => {
  //   const newOrderList = orderList.filter(order => (statusFilter === 'All') || (order.status === statusFilter))
  //   console.log('current orderlist: ', newOrderList)
  //   setCurrentOrderList(newOrderList)
  // }, [orderList, statusFilter])

  const handleOnClickDeleteOrder = (index) => {
    const orderRef = db.collection("Orders").doc(index)
    orderRef.delete()
  }

  const statusColor = (status) => {
    if (status.toLowerCase() === 'pending') return 'red'
    else if (status.toLowerCase() === 'processing') return 'orange'
    else if (status.toLowerCase() === 'delivered') return 'green'
    else if (status.toLowerCase() === 'cancelled') return 'gray'
  }

  const extractLimit = (field) => {
    if (field === "Last 5 orders") return 5
    else if (field === "Last 15 orders") return 15
    else if (field === "Last 30 orders") return 30
    else if (field === "Last 50 orders") return 50
    else if (field === "All") return Infinity
  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow" style={{ minHeight: '50vh' }}>

              <CardHeader className="border-0">
                <h3 className="mb-0">Orders table</h3>
              </CardHeader>

              <Table className="align-items-center table-hover" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col" />
                    <th scope="col">Order ID</th>
                    <th scope="col">Address</th>
                    <th scope="col">
                      <div className='d-flex'>
                        <div className='align-middle '>Status</div>
                        <Filter
                          header='Status'
                          onChangeFilter={(status) => setStatusFilter(status)}
                          title={statusFilter}
                          fields={['All', 'pending', 'processing', 'delivered', 'cancelled']}
                        />
                      </div>

                    </th>
                    <th scope="col" >
                      <div className='d-flex'>
                        <div className='align-middle'>Order Time</div>
                        <Filter
                          header='Order Time'
                          onChangeFilter={(status) => setTimeFilter(status)}
                          title={timeFilter}
                          fields={['All', 'Last 5 orders', 'Last 15 orders', 'Last 30 orders', 'Last 50 orders']}
                        />
                      </div>
                    </th>
                    {/* <th scope="col">Delivery Time</th> */}
                  </tr>
                </thead>
                <tbody style={{ minHeight: '500px' }}>
                  {orderList.map((order) => (
                    <tr>
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu persist className="dropdown-menu-arrow" right>
                            {/* <DropdownItem
                            >
                              <ChangeStatusModal orderid={order.id} orderstatus={order.status.toLowerCase()} />
                            </DropdownItem> */}
                            <DropdownItem
                              href={`${match.url}/${order.id}`}
                            >
                              Detail
                          </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={() => handleOnClickDeleteOrder(order.id)}
                            >
                              Delete
                          </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                      <th scope="row">{order.id}</th>
                      <td>{order.address}</td>
                      <td>
                        <Badge color="" className="badge-dot mr-4">
                          {/* <i className="bg-warning" /> */}
                          <FaCircle color={statusColor(order.status)} />{' '}
                          {order.status.toLowerCase()}
                        </Badge>
                      </td>
                      <td>{new Date(order.orderTime).toString()}</td>
                      {/* <td>{order.deliverTime}</td> */}
                    </tr>
                  ))}

                </tbody>
              </Table>


              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>

            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Orders;
