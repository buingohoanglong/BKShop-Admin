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
import React, { useState, useEffect } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import db from "firebase/firebase.config";
import { getNodeMajorVersion, isJSDocAugmentsTag } from "typescript";
import { get } from "jquery";

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  // const [chartExample1Data, setChartExample1Data] = useState("data1");

  const [chartBrandData, setChartBrandData] = useState(Array(9).fill(0))
  const brandIndex = {
    apple: 0,
    xiaomi: 1,
    huawei: 2,
    lg: 3,
    hp: 4,
    dell: 5,
    asus: 6,
    vaio: 7,
    others: 8,
  }


  const [chartOrderData, setChartOrderData] = useState(Array(12).fill(0))
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


  const [chartYearSaleData, setChartYearSaleData] = useState(Array(12).fill(0))
  const [chartMonthSaleData, setChartMonthSaleData] = useState(Array(31).fill(0))
  const [yearSelected, setYearSelected] = useState(true)

  useEffect(() => {
    // load brand chart data
    db.collection('Products').get().then((querySnapshot) => {
      const data = Array(9).fill(0)
      querySnapshot.docs.forEach((productDoc) => {
        const brandName = productDoc.data().specification['brand'] ? productDoc.data().specification['brand'] : 'others'
        if (!Object.keys(brandIndex).includes(brandName.toLowerCase())) {
          data[brandIndex['others']] += 1
        } else {
          data[brandIndex[brandName.toLowerCase()]] += 1
        }
      })
      console.log("Brand data: ", data)
      setChartBrandData(data)
    })
  }, [])

  useEffect(() => {
    // get order chart data
    db.collection('Orders').get().then((querySnapshot) => {
      const data = Array(12).fill(0)
      querySnapshot.docs.forEach((orderDoc) => {
        const orderTime = new Date(Date.parse(orderDoc.data().orderTime))
        const orderYear = orderTime.getFullYear()
        const thisYear = new Date(Date.now()).getFullYear()
        if (orderYear === thisYear) {
          const orderMonth = orderTime.getMonth()
          data[orderMonth] += 1
        }
      })
      console.log("Order data: ", data)
      setChartOrderData(data)
    })
  }, [])

  useEffect(() => {
    // get sale chart year data
    db.collection('Orders').get().then((querySnapshot) => {
      const data = Array(12).fill(0)
      querySnapshot.docs.forEach((orderDoc) => {
        const orderTime = new Date(Date.parse(orderDoc.data().orderTime))
        const orderYear = orderTime.getFullYear()
        const thisYear = new Date(Date.now()).getFullYear()
        if (orderYear === thisYear) {
          if (orderDoc.data().status === 'delivered') {
            const orderMonth = orderTime.getMonth()
            data[orderMonth] += orderDoc.data().items.reduce((sum, item) => sum + item.quantity, 0)
          }
        }
      })
      console.log('Year Sales data: ', data)
      setChartYearSaleData(data)
    })
  }, [])

  const getNumberOfDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  useEffect(() => {
    // get sale chart month data
    db.collection('Orders').get().then((querySnapshot) => {
      const data = Array(getNumberOfDaysInMonth(new Date(Date.now()))).fill(0)
      querySnapshot.docs.forEach((orderDoc) => {
        const orderTime = new Date(Date.parse(orderDoc.data().orderTime))
        const orderYear = orderTime.getFullYear()
        const orderMonth = orderTime.getMonth()
        const thisYear = new Date(Date.now()).getFullYear()
        const thisMonth = new Date(Date.now()).getMonth()
        if ((orderYear === thisYear) && (orderMonth === thisMonth)) {
          if (orderDoc.data().status === 'delivered') {
            const orderDate = orderTime.getDate()
            data[orderDate - 1] += orderDoc.data().items.reduce((sum, item) => sum + item.quantity, 0)
          }
        }
      })
      console.log('Month Sales data: ', data)
      setChartMonthSaleData(data)
    })
  }, [])


  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    if (index === 1) {
      setYearSelected(true)
    } else {
      setYearSelected(false)
    }
  };


  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>

          <Col className="mb-5 mb-xl-0" xl="12">
            {/* Sale chart */}
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Sales value</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Month</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2,
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 2)}
                        >
                          <span className="d-none d-md-block">Week</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              {/* Chart */}
              <CardBody>
                <div className="chart">
                  <Line
                    data={{
                      labels: yearSelected ? months : [...Array(chartMonthSaleData.length).keys()].map((key) => key + 1),
                      datasets: [
                        {
                          label: "Performance",
                          data: yearSelected ? chartYearSaleData : chartMonthSaleData,
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        yAxes: [
                          {
                            gridLines: {
                              color: '#212529',
                              zeroLineColor: '#212529',
                            },
                            ticks: {
                              callback: function (value) {
                                const step = Math.round(Math.max(chartOrderData) / 10)
                                if (!(value % step)) {
                                  return value;
                                }
                              },
                            },
                          },
                        ],
                      },
                      tooltips: {
                        callbacks: {
                          label: function (item, data) {
                            var label = data.datasets[item.datasetIndex].label || "";
                            var yLabel = item.yLabel;
                            var content = "";

                            if (data.datasets.length > 1) {
                              content += label;
                            }

                            content += yLabel + ' items';
                            return content;
                          },
                        },
                      },
                    }}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>

        </Row>


        <Row className='justify-content-start my-4'>

          {/* Order chart */}
          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">Total orders</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Bar
                    data={{
                      labels: months,
                      datasets: [
                        {
                          label: "Orders",
                          data: [...chartOrderData],
                          maxBarThickness: 10,
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        yAxes: [
                          {
                            ticks: {
                              callback: function (value) {
                                if (!(value % Math.round(Math.max(chartOrderData) / 10))) {
                                  //return '$' + value + 'k'
                                  return value;
                                }
                              },
                            },
                          },
                        ],
                      },
                      tooltips: {
                        callbacks: {
                          label: function (item, data) {
                            var label = data.datasets[item.datasetIndex].label || "";
                            var yLabel = item.yLabel;
                            var content = "";
                            if (data.datasets.length > 1) {
                              content += label;
                            }
                            content += yLabel + ' items';
                            return content;
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col xl='6'>
            <Card className="shadow">
              <CardHeader className="bg-gradient-default">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1 text-white">
                      Brands
                    </h6>
                    <h2 className="mb-0 text-white">Total products</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody className="bg-gradient-default">
                {/* Chart */}
                <div className="chart">
                  <Bar
                    data={{
                      labels: Object.keys(brandIndex),
                      datasets: [
                        {
                          label: "Products",
                          data: [...chartBrandData],
                          maxBarThickness: 40,
                          backgroundColor: 'white',
                        },
                      ]
                    }}
                    options={{
                      scales: {
                        yAxes: [
                          {
                            ticks: {
                              callback: function (value) {
                                if (!(value % Math.round(Math.max(chartBrandData) / 10))) {
                                  //return '$' + value + 'k'
                                  return value;
                                }
                              },
                            },
                          },
                        ],
                      },
                      tooltips: {
                        callbacks: {
                          label: function (item, data) {
                            var label = data.datasets[item.datasetIndex].label || "";
                            var yLabel = item.yLabel;
                            var content = "";
                            if (data.datasets.length > 1) {
                              content += label;
                            }
                            content += yLabel + ' items';
                            return content;
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

      </Container>
    </>
  );
};

export default Index;
