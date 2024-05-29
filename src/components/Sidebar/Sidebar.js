import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import s from "./Sidebar.module.scss";
import LinksGroup from "./LinksGroup/LinksGroup.js";
import { changeActiveSidebarItem } from "../../actions/navigation.js";
// import SofiaLogo from "../Icons/SofiaLogo.js";
import JajaLogo from "../../assets/images/jaja-auto-white-v2.png";
import cn from "classnames";

const Sidebar = (props) => {

  const {
    activeItem = '',
    ...restProps
  } = props;

  const [burgerSidebarOpen, setBurgerSidebarOpen] = useState(false)

  useEffect(() => {
    if (props.sidebarOpened) {
      setBurgerSidebarOpen(true)
    } else {
      setTimeout(() => {
        setBurgerSidebarOpen(false)
      }, 0);
    }
  }, [props.sidebarOpened])

  return (
    <nav className={cn(s.root, {[s.sidebarOpen]: burgerSidebarOpen})} >
      <header className={s.logo}>
        <img src={JajaLogo} alt="Contoh Gambar" className={s.LogoImg}/>
        <span className={s.title}>Jaja Auto</span>
      </header>
      <ul className={s.nav}>
        {/* <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Dashboard"
          isHeader
          iconName={<i className={'eva eva-home-outline'}/>}
          link="/jaja-auto/dashboard"
          index="dashboard"
          badge="9"
        /> */}
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Jaja Dashboard"
          isHeader
          iconName={<i className={'eva eva-home-outline'}/>}
          link="/jaja-auto/jaja-dashboard"
          index="jaja-dashboard"
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Kategori"
          isHeader
          iconName={<i className={'eva eva-grid-outline'}/>}
          link="/jaja-auto/kategori"
          index="kategori"
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Product"
          isHeader
          iconName={<i className={'eva eva-car-outline'}/>}
          link="/jaja-auto/product"
          index="product"
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Jenis Mobil"
          isHeader
          iconName={<i className={'eva eva-settings-outline'}/>}
          link="/jaja-auto/jenisMobil"
          index="jenisMobil"
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Brand"
          isHeader
          iconName={<i className={'eva eva-globe-2-outline'}/>}
          link="/jaja-auto/brand"
          index="brand"
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Bank"
          isHeader
          iconName={<i className={'eva eva-credit-card-outline'}/>}
          link="/jaja-auto/bank"
          index="bank"
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Order"
          isHeader
          iconName={<i className={'eva eva-shopping-bag-outline'}/>}
          link="/jaja-auto/order"
          index="order"
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Bunga"
          isHeader
          iconName={<i className={'eva eva-percent'}/>}
          link="/jaja-auto/config-bunga"
          index="ConfigBunga"
        />
        {/* <h5 className={s.navTitle}>jaja-auto</h5> */}
        {/* <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Typography"
          isHeader
          iconName={<i className={'eva eva-text-outline'}/>}
          link="/jaja-auto/typography"
          index="typography"
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Tables"
          isHeader
          iconName={<i className={'eva eva-grid-outline'}/>}
          link="/jaja-auto/tables"
          index="tables"
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Notifications"
          isHeader
          iconName={<i className={'eva eva-bell-outline'}/>}
          link="/jaja-auto/notifications"
          index="notifications"
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="UI Elements"
          isHeader
          iconName={<i className={'eva eva-cube-outline'}/>}
          link="/jaja-auto/uielements"
          index="uielements"
          childrenLinks={[
            {
              header: 'Charts', link: '/jaja-auto/ui-elements/charts',
            },
            {
              header: 'Icons', link: '/jaja-auto/ui-elements/icons',
            },
            {
              header: 'Google Maps', link: '/jaja-auto/ui-elements/maps',
            },
          ]}
        /> */}
      </ul>
      {/* <div className="bg-widget d-flex mt-auto ml-1">
        <Button className="rounded-pill my-3 body-2 d-none d-md-block" type="submit" color="secondary-red">Unlock Full Version</Button>
      </div> */}
    </nav>
  );
}

Sidebar.propTypes = {
  sidebarOpened: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  activeItem: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    activeItem: store.navigation.activeItem,
  };
}

export default withRouter(connect(mapStateToProps)(Sidebar));
