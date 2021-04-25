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
import db from "firebase/firebase.config";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const Header = () => {

  const [numUsers, setNumUsers] = useState(0)
  const [sales, setSales] = useState(0)
  const [numProducts, setNumProducts] = useState(0)
  const [numOrders, setNumOrders] = useState(0)

  useEffect(() => {
    // get number of users
    db.collection('Users').get().then((querySnapshot) => {
      setNumUsers(querySnapshot.docs.length)
    })
  }, [])

  useEffect(() => {
    // get number of product type
    db.collection('Products').get().then((querySnapshot) => {
      setNumProducts(querySnapshot.docs.length)
    })
  }, [])

  useEffect(() => {
    // get current year sales
    db.collection('Orders').get().then((querySnapshot) => {
      const yearSales = querySnapshot.docs.reduce((sum, orderDoc) => {
        const orderTime = new Date(Date.parse(orderDoc.data().orderTime))
        const orderYear = orderTime.getFullYear()
        const thisYear = new Date(Date.now()).getFullYear()
        if (orderYear === thisYear) {
          if (orderDoc.data().status == 'delivered') {
            return sum + orderDoc.data().items.reduce((subsum, item) => subsum + item.quantity, 0)
          } else return sum
        } else return sum
      }, 0)

      console.log('Year Sales: ', yearSales)
      setSales(yearSales)
    })
  }, [])

  useEffect(() => {
    // get number of orders current year
    db.collection('Orders').get().then((querySnapshot) => {
      const yearOrders = querySnapshot.docs.reduce((sum, orderDoc) => {
        const orderTime = new Date(Date.parse(orderDoc.data().orderTime))
        const orderYear = orderTime.getFullYear()
        const thisYear = new Date(Date.now()).getFullYear()
        return orderYear === thisYear ? sum + 1 : 0
      }, 0)

      console.log('Number order this year: ', yearOrders)
      setNumOrders(yearOrders)
    })
  }, [])

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>

              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Users
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {numUsers}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> 3.48%
                      </span>{" "}
                      <span className="text-nowrap">Since last month</span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>

              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Orders
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{numOrders}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="ni ni-cart" />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-danger mr-2">
                        <i className="fas fa-arrow-down" /> 3.48%
                      </span>{" "}
                      <span className="text-nowrap">Since last week</span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>

              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Sales
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{sales}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-green text-white rounded-circle shadow">
                          <i className="ni ni-chart-bar-32" />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-warning mr-2">
                        <i className="fas fa-arrow-down" /> 1.10%
                      </span>{" "}
                      <span className="text-nowrap">Since yesterday</span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>

              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Products
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{numProducts}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="ni ni-laptop" />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fas fa-arrow-up" /> 12%
                      </span>{" "}
                      <span className="text-nowrap">Since last month</span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
