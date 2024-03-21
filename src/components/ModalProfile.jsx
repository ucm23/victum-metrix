
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import {
    useBreakpointValue,
} from '@chakra-ui/react'

import { useState, useEffect } from 'react'
import { Layout, List, Avatar, Switch, Flex, Dropdown } from 'antd';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

import { CloseOutlined } from "@ant-design/icons";
import CloseIcon from '@mui/icons-material/Close';

import { useStore, useDispatch } from "react-redux";

import TextField from '@mui/material/TextField';

import { Button, theme } from 'antd';
import { colorPrimary } from '../theme';
import { Divider } from '@chakra-ui/react'

import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti';

import { notification, message } from 'antd';

const { Header, Content } = Layout;

function TabLabel(props) {
    const { label, icon, disabled } = props;

    return (
        <Tab disabled={disabled} _selected={{ color: 'black', bg: '#B6B6B650', borderRadius: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'row', width: 95, justifyContent: 'flex-start', gap: 6 }}>
                {icon ? <AccountCircleIcon /> : <AdminPanelSettingsIcon />}
                <h1>{label}</h1>
            </div>
        </Tab>
    );
}


function ModalProfile({ onClose }) {

    const store = useStore();

    const { information_user } = store.getState().login;

    return (
        <div>
            <Tabs isLazy orientation="vertical" variant='unstyled'>
                <div style={{ padding: 10, paddingTop: 40 }}>
                    <TabList>
                        <TabLabel
                            label={'Cuenta'}
                            icon={true}
                        />
                        <TabLabel
                            label={'Seguridad'}
                            disabled={true}
                        />
                    </TabList>
                </div>
                <div style={{ width: 1, backgroundColor: 'gray', height: 600 }} />
                <div style={{ paddingTop: 25, width: '100%', paddingBottom: 25, }}>
                    <TabPanels>
                        <TabPanel>
                            <div style={{ overflowX: 'auto', height: 550 }}>
                                <Typography variant="h4">
                                    Mis datos
                                </Typography>
                                <Typography variant="overline" gutterBottom style={{ textTransform: 'capitalize' }}>
                                    Administra tus datos
                                </Typography>
                                <div style={{ marginTop: 25 }}>
                                    <Typography variant="button" gutterBottom style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                                        Nombre
                                    </Typography>
                                    <hr />
                                    <Typography variant="button" gutterBottom style={{ textTransform: 'initial' }}>
                                        <h1>{`${information_user?.first_name} ${information_user?.last_name}`}</h1>
                                    </Typography>
                                </div>
                                <div style={{ marginTop: 25 }}>
                                    <Typography variant="button" gutterBottom style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                                        Correo electrónico
                                    </Typography>
                                    <hr />
                                    <Typography variant="button" gutterBottom style={{ textTransform: 'initial' }}>
                                        {information_user?.email}
                                    </Typography>
                                </div>
                                <div style={{ marginTop: 25 }}>
                                    <Typography variant="button" gutterBottom style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                                        {information_user?.company?.name}
                                    </Typography>
                                    <hr />
                                    <Typography variant="button" gutterBottom style={{ textTransform: 'initial' }}>
                                        No. empleado: {information_user?.code}
                                    </Typography>
                                    <br />
                                    <Typography variant="button" gutterBottom style={{ textTransform: 'initial' }}>
                                        Departamento: {information_user?.section?.name}
                                    </Typography>
                                    <br />
                                    <Typography variant="button" gutterBottom style={{ textTransform: 'initial' }}>
                                        Cargo: {information_user?.role?.name}
                                    </Typography>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <Typography variant="h4">
                                Seguridad
                            </Typography>
                            <Typography variant="overline" gutterBottom style={{ textTransform: 'capitalize' }}>
                                En construcción, estamos trabajando en este módulo
                            </Typography>
                        </TabPanel>
                    </TabPanels>
                </div>
            </Tabs>
        </div >
    )
}

export default ModalProfile
