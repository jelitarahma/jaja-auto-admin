// -- React and related libs
import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from "react-router-dom";


// -- Third Party Libs
import PropTypes from "prop-types";

// -- Custom Components
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";
import Breadcrumbs from "../Breadbrumbs/Breadcrumbs";
import Dashboard from "../../pages/dashboard/Dashboard";
import Typography from "../../pages/typography/Typography";
import Notifications from "../../pages/notifications/Notifications";
import Tables from "../../pages/tables/Tables";
import Charts from "../../pages/uielements/charts/Charts";
import Icons from "../../pages/uielements/icons/IconsPage";
import Maps from "../../pages/uielements/maps/google/GoogleMapPage";
import Kategori from "../../pages/kategori/kategori";
import Product from "../../pages/product/product";
import JenisMobil from "../../pages/jenisMobil/JenisMobil";
import Brand from "../../pages/brand/Brand";
import Bank from "../../pages/bank/Bank";
import Order from "../../pages/order/Order";
import DetailProduct from "../../pages/product/detailProduct";
import JajaDashboard from "../../pages/jajaDashboard/dashboard";
import ConfigBunga from "../../pages/bunga/configBunga";

// -- Component Styles
import s from "./Layout.module.scss";
import ErrorPage from "../../pages/error/ErrorPage";
import DetailOrder from "../../pages/order/detailOrder";
import Bunga from "../../pages/bunga/Bunga";

const Layout = (props) => {
  return (
    <Router>
  <div className={s.root}>
    <div className={s.wrap}>
      <Header />
      <Sidebar />
      <main className={s.content}>
        {/* <Breadcrumbs url={props.location.pathname} /> */}
        <Switch>
          <Route path="/" exact render={() => <Redirect to="/dashboard/jaja-dashboard"/>} />
          <Route path="/dashboard/dashboard" exact component={Dashboard}/>
          <Route path="/dashboard/jaja-dashboard" exact component={JajaDashboard}/>
          <Route path="/dashboard/typography" exact component={Typography} />
          <Route path="/dashboard/tables" exact component={Tables} />
          <Route path="/dashboard/notifications" exact component={Notifications} />
          <Route path="/dashboard/ui-elements" exact render={() => <Redirect to={"/dashboard/ui-elements/charts"} />} />
          <Route path="/dashboard/ui-elements/charts" exact component={Charts} />
          <Route path="/dashboard/ui-elements/icons" exact component={Icons} />
          <Route path="/dashboard/ui-elements/maps" exact component={Maps} />
          <Route path="/dashboard/kategori" exact component={Kategori} />
          <Route path="/dashboard/product" exact component={Product} />
          <Route path="/dashboard/jenisMobil" exact component={JenisMobil} />
          <Route path="/dashboard/brand" exact component={Brand} />
          <Route path="/dashboard/bank" exact component={Bank} />
          <Route path="/dashboard/order" exact component={Order} />
          <Route path="/dashboard/order/:orderId" exact component={DetailOrder} />
          <Route path="/dashboard/product/:slug" exact component={DetailProduct} />
          <Route path="/dashboard/config-bunga" exact component={ConfigBunga} />
          <Route path="/dashboard/bunga" exact component={Bunga} />
          <Route path='*' exact component={ErrorPage} />
        </Switch>
      </main>
      {/* <Footer /> */}
    </div>
  </div>
</Router>

  );
}

Layout.propTypes = {
  sidebarOpened: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
  };
}

export default withRouter(connect(mapStateToProps)(Layout));