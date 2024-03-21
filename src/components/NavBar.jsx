import { Layout, } from 'antd'

import { Breadcrumb, } from 'antd';

import { NavLink } from "react-router-dom";

const { Header, Content } = Layout;

const NavBar = ({ name, children }) => {

   return (
      <Layout>
         <Header className='bg-white' style={{ padding: 0, flexDirection: 'row', display: 'flex', alignItems: 'center', borderBottomWidth: 0.5, paddingLeft: 30 }}>
            <Breadcrumb>
               <Breadcrumb.Item className='bread-crumb'>
                  <NavLink to={`/`}>{name}</NavLink>
               </Breadcrumb.Item>
            </Breadcrumb>
         </Header>
         <Content style={{ backgroundColor: 'rgb(248,248,248)' }}>
            {children}
         </Content>
      </Layout>
   )
}

export default NavBar
