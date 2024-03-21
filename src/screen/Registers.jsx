import React from 'react';
import { useEffect, useState, useMemo, useContext } from "react";
import { CourseCard } from "../components/CourseCard";
import ModalForm from "../components/ModalForm";


import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useStore, useDispatch } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';

import { Layout, Empty } from 'antd'
import { get_evaluated_participants, get_users } from "../api/main/main";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

import { notification } from 'antd';
import Loading from "../components/Loading";
import Emptiness from "../components/Emptiness";

import { Dropdown, } from 'antd';

import Context from '../main/Context';
import ModalProfile from '../components/ModalProfile';
import Typography from '@mui/material/Typography';

const { Header } = Layout;
const { Sider, Content } = Layout;

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import { FileDoneOutlined, ArrowLeftOutlined, MoreOutlined } from '@ant-design/icons';



import { Breadcrumb, Spin, Flex } from 'antd';

import { Avatar } from 'antd';
import ModalResponses from '../components/ModalResponses';
import { useNavigate } from 'react-router-dom';

function TabLabel(props) {
    const { label, } = props;

    return (
        <Tab _selected={{ color: 'black', bg: '#B6B6B650', borderRadius: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'row', width: 95, justifyContent: 'flex-start', gap: 6 }}>
                <h1>{label}</h1>
            </div>
        </Tab>
    );
}



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    height: 600,
    //maxHeight: '50%',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
};

const styleModal = {
    position: 'absolute',
    top: '0%',
    left: '0%',
    bottom: '0%',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
};

const status = [
    {
        name: 'Pendiente',
        icon: '⏰',
        status: 1,
    },
    {
        name: 'En progreso',
        icon: '⌛',
        status: 2,
    },
    {
        name: 'Terminado',
        icon: '✅',
        status: 3,
    }
]

function Registers({ }) {

    const store = useStore();

    const { information_user } = store.getState().login;
    let color_primary = information_user?.company?.color
    const [users, setUsers] = useState([])
    const [user, setUser] = useState({})
    const [load, setLoad] = useState(false)
    const [count_state, setcount_state] = useState(0)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        getUsers()
    }, [])

    const getUsers = async () => {
        try {
            let response = await get_users({ id: information_user?.company?.id })
            if (response?.status) {
                setUsers(response?.data)
                getData({ user: response?.data[0] })
                setUser(response?.data[0])
                setLoad(true)
            }
        } catch (error) {
            console.log('error: ', error);
        } finally {

        }
    }

    const [filterA, setFilterA] = useState('')

    const filterData = (data, filterA) => {
        if (filterA) {
            let upper = filterA.toLowerCase();
            return data.filter(item => item?.first_name.toLowerCase().includes(upper) || item?.last_name.toLowerCase().includes(upper))
        } else return data
    }

    const memoizedValue = useMemo(() =>
        filterData(users, filterA)
        , [users, filterA]);

    const getData = async ({ user }) => {
        try {
            setLoading(false)
            let response = await get_evaluated_participants({ company_id: information_user?.company?.id, evaluator_user_id: user?.id, mode: false })
            setData(response?.data)
            let count = 0;
            for (const iterator of response?.data || []) {
                if (iterator?.ended_at) count += 1
            }
            setcount_state(count)
        } catch (error) {
            console.log('error: ', error);
        } finally {
            setLoading(true)
        }
    }

    const [item, setItem] = useState({});
    const [open, setOpen] = useState(false);
    const onToggleModal = () => {
        setOpen(!open);
    };

    const handleTeamClick = ({ item, status }) => {
        try {
            //let scheduled = rubric.find(i => item?.scheduled_evaluation_id === i?.id)
            //console.log('scheduled: ', scheduled);
            onToggleModal()
            setItem({ ...item, status })
        } catch (error) {
            console.log('error handleTeamClick: ', error);
        }
    };

    const renderItem_ = ({ item, index }) => {
        let status = ''
        if (item?.responses === null && !item?.ended_at) status = '⏰  Pendiente'
        if (item?.responses !== null && !item?.ended_at) status = '⌛  En progreso'
        if (item?.ended_at) status = '✅  Terminado'

        return (
            <tr onClick={() => handleTeamClick({ item, status })} >
                <td>
                    <h3 className="table-column-name" style={{ marginLeft: 4 }}>{item?.evaluator_user?.first_name} {item?.evaluator_user?.last_name}</h3>
                </td>
                <td>
                    <h3 className="table-column-label">{status}</h3>
                </td>
                <td style={{ width: '1%' }}>
                    <a onClick={(e) => e.preventDefault()} >
                        <div className="table-column-logo" style={{ marginRight: 5 }}>
                            <MoreOutlined />
                        </div>
                    </a>
                </td>
            </tr>
        );
    };

    const handleChange = (event) => {
        const { value } = event.currentTarget;
        setFilterA(value);
    }


    return (
        <div style={{}}>
            {load ?
                <Tabs isLazy orientation="vertical" style={{ padding: 2, paddingTop: 10, maxHeight: '100vh' }}>
                    <div style={{ padding: 2, paddingTop: 10, overflowX: 'auto' }}>
                        <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', padding: 2, gap: 5 }}>
                            <ArrowLeftOutlined onClick={() => navigate(-1) } />
                            <input
                                type="text"
                                autoComplete="text"
                                placeholder='Buscar...'
                                value={filterA}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <TabList style={{}}>
                            {memoizedValue.map((item, index) => (
                                <Tab
                                    key={`${item?.first_name}-${index}`}
                                    onClick={() => {
                                        getData({ user: item });
                                        setUser(item)
                                    }}
                                    style={{}}
                                >
                                    <h1 style={{ textTransform: 'uppercase' }}>{item?.first_name} {item?.last_name}</h1>
                                </Tab>
                            ))}
                        </TabList>
                    </div>
                    <div style={{ paddingTop: 25, width: '100%', paddingBottom: 25, }}>
                        <TabPanels>
                            <div style={{ margin: 8 }}>
                                {user &&
                                    <>
                                        <Typography variant="h4">
                                            {user?.first_name} {user?.last_name} ({user?.code})
                                        </Typography>
                                        <Typography variant="overline" gutterBottom style={{ textTransform: 'capitalize' }}>
                                            Administra a los evaluadores
                                        </Typography>
                                    </>
                                }
                                {/*(count_state >= 2 && data.length) && <h1>Ver reporte individual</h1>*/}
                                <div className="table">
                                    <table style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                {['Nombre', 'Estado',].map((item, index) => (
                                                    <th key={`${index}-${item}-${index}`} style={{ paddingLeft: index === 0 ? 6 : 0, color: 'gray', fontWeight: 'bold', fontSize: 12 }}>{item}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((item, index) => renderItem_({ item, index }))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </TabPanels>
                    </div>
                </Tabs> : <Loading />}

            <Modal
                open={open}
                onClose={onToggleModal}
            >
                <Box sx={{ ...style }}>
                    <ModalResponses
                        item={item}
                        user={user}
                        onClose={onToggleModal}
                    />
                </Box>
            </Modal>
        </div>
    )
}

export default Registers
