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
          <Route path="/" exact render={() => <Redirect to="/jaja-auto/jaja-dashboard"/>} />
          <Route path="/jaja-auto/dashboard" exact component={Dashboard}/>
          <Route path="/jaja-auto/jaja-dashboard" exact component={JajaDashboard}/>
          <Route path="/jaja-auto/typography" exact component={Typography} />
          <Route path="/jaja-auto/tables" exact component={Tables} />
          <Route path="/jaja-auto/notifications" exact component={Notifications} />
          <Route path="/jaja-auto/ui-elements" exact render={() => <Redirect to={"/jaja-auto/ui-elements/charts"} />} />
          <Route path="/jaja-auto/ui-elements/charts" exact component={Charts} />
          <Route path="/jaja-auto/ui-elements/icons" exact component={Icons} />
          <Route path="/jaja-auto/ui-elements/maps" exact component={Maps} />
          <Route path="/jaja-auto/kategori" exact component={Kategori} />
          <Route path="/jaja-auto/product" exact component={Product} />
          <Route path="/jaja-auto/jenisMobil" exact component={JenisMobil} />
          <Route path="/jaja-auto/brand" exact component={Brand} />
          <Route path="/jaja-auto/bank" exact component={Bank} />
          <Route path="/jaja-auto/order" exact component={Order} />
          <Route path="/jaja-auto/product/:slug" exact component={DetailProduct} />
          <Route path="/jaja-auto/config-bunga" exact component={ConfigBunga} />
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