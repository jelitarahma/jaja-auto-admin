import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Progress,
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import { Row, Col, Collapse, Badge } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

import Widget from "../../components/Widget/Widget.js";
import ApexActivityChart from "../dashboard/components/ActivityChart.js";
import gymIcon from "../../assets/dashboard/gymIcon.svg";
import therapyIcon from "../../assets/dashboard/therapyIcon.svg";
import topBrandIcon1 from "../../assets/dashboard/top-brand.png";
import topBrandIcon2 from "../../assets/dashboard/top-brand (2).png";
import car from "../../assets/dashboard/car.png";
import application from "../../assets/dashboard/application.png";
import timer from "../../assets/dashboard/timer.png";

import s from "../dashboard/Dashboard.module.scss";

const { Panel } = Collapse;

const JajaDashboard = () => {
  const [checkboxes, setCheckboxes] = useState([true, false]);
  const token = localStorage.getItem("token");
  const [dataTopProduct, setData] = useState([]);

  const [topView, setTopView] = useState([]);
  const [topCategory, setTopCategory] = useState([]);
  const [topLatest, setTopLatest] = useState([]);

  const [visibleItems, setVisibleItems] = useState(3);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`https://staging-api.jaja.id/dashboard/get-top-product`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const { top_view, top_category, top_latest } = data.data;
        setTopView(top_view);
        setTopCategory(top_category);
        setTopLatest(top_latest);
        console.log("Top View:", top_view);
        console.log("Top Category:", top_category);
        console.log("Top Latest:", top_latest);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleShowMore = () => {
    setVisibleItems(topView.length);
  };

  const handleShowLess = () => {
    setVisibleItems(3);
  };

  return (
    <>
      <Row>
        <Col span={10} className="p-2">
          <Widget className="p-4">
            <p className="headline-3">Top View</p>
            {topView.slice(0, visibleItems).map((product_top, index) => (
              <div key={index} className={`mt-3 ${s.widgetBlock}`}>
                <div className={s.widgetBody}>
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div className="d-flex justify-content-between align-items-center">
                      <img
                        className="img-fluid mr-2"
                        src={car}
                        alt="..."
                        style={{ width: "32px", height: "32px" }}
                      />
                      <div className="d-flex flex-column">
                        <p className="body-2">{product_top.code}</p>
                        <p
                          className="body-3 muted"
                          style={{
                            textTransform: "capitalize",
                            fontWeight: 500,
                          }}
                        >
                          {product_top.name}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Badge
                        count={product_top.viewed}
                        overflowCount={999999}
                        style={{ backgroundColor: "#ffce30" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="d-flex justify-content-center mt-3">
              {visibleItems < topView.length ? (
                <DownOutlined
                  onClick={handleShowMore}
                  style={{ fontSize: "24px", cursor: "pointer" }}
                />
              ) : (
                <UpOutlined
                  onClick={handleShowLess}
                  style={{ fontSize: "24px", cursor: "pointer" }}
                />
              )}
            </div>
          </Widget>
        </Col>
        <Col span={14} className="p-2">
          <div>
            <Widget>
              <div className="d-flex justify-content-between widget-p-md">
                <div className="headline-3 d-flex align-items-center">
                  Activity
                </div>
              </div>
              <ApexActivityChart className="pb-4" />
            </Widget>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={12} className="p-2">
        <Widget className="widget-p-md">
                <div className="d-flex justify-content-between">
                  <div className="headline-3 d-flex align-items-center">Top Category</div>
                </div>
                {topCategory.map((category) =>
                  <div key={uuidv4()} className={`mt-4 ${s.widgetBlock}`}>
                    <div className={s.widgetBody}>
                      <div className="d-flex">
                        <img className="img-fluid mr-2" src={application} alt="..." style={{ width: "32px", height: "32px" }}/>
                        <div className="d-flex flex-column">
                          <p className="body-2">{category.name}</p>
                          <p className="body-3 muted">{category.brand}</p>
                        </div>
                      </div>
                      <div className="body-3 muted">
                        {category.code}
                      </div>
                    </div>
                  </div>
                )}
              </Widget>
        </Col>
        <Col span={12} className="p-2">
        <Widget className="widget-p-md">
                <div className="d-flex justify-content-between">
                  <div className="headline-3 d-flex align-items-center">Top Latest</div>
                </div>
                {topLatest.map((l) =>
                  <div key={uuidv4()} className={`mt-4 ${s.widgetBlock}`}>
                    <div className={s.widgetBody}>
                      <div className="d-flex">
                        <img className="img-fluid mr-2" src={timer} alt="..." style={{ width: "32px", height: "32px" }}/>
                        <div className="d-flex flex-column">
                          <p className="body-2">{l.name}</p>
                          <p className="body-3 muted">{l.brand}</p>
                        </div>
                      </div>
                      <div className="body-3 muted">
                        {l.code}
                      </div>
                    </div>
                  </div>
                )}
              </Widget>
        </Col>
      </Row>
    </>
  );
};

export default JajaDashboard;
