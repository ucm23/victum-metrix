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
import LogoutIcon from '@mui/icons-material/Logout';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';

import { Layout, Empty } from 'antd'
import { get_evaluated_participants } from "../api/main/main";

import { notification } from 'antd';
import Loading from "../components/Loading";
import Emptiness from "../components/Emptiness";

import { Dropdown, } from 'antd';

import Context from '../main/Context';
import ModalProfile from '../components/ModalProfile';

import { useNavigate } from 'react-router-dom';


const { Header } = Layout;


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

function Dashboards({ }) {
    const [open, setOpen] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [item, setItem] = useState({});
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [rubric, setRubric] = useState([]);

    const store = useStore();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { signOut } = useContext(Context);


    const { information_user } = store.getState().login;
    const salir = () => {
        const cadenaOriginal = information_user?.email;
        const caracterAEliminar = '.';

        // Utiliza una expresión regular con la opción 'g' (global) para eliminar todas las ocurrencias
        const cadenaSinCaracter = cadenaOriginal.replace(new RegExp(caracterAEliminar, 'g'), '');

        console.log(cadenaSinCaracter);
        signOut()
        navigate(`/${information_user?.company?.id}/ /`);
        

    };
    const goToRegisters = () => {
        navigate(`/registers`);
    };


    const onToggleModalProfile = () => {
        setOpenProfile(!openProfile);
    };
    const onToggleModal = () => {
        setOpen(!open);
    };

    const items = [
        {
            label: (
                <a target="_blank" rel="noopener noreferrer" onClick={onToggleModalProfile}>
                    <div style={{ display: 'flex', flexDirection: 'row', width: 250, justifyContent: 'flex-start', gap: 20 }}>
                        <AccountCircleIcon />
                        <h1>Mis datos</h1>
                    </div>
                </a>
            ),

        }
    ]

    if (information_user?.id === 52 || information_user?.id === 53 || information_user?.id === 54 || information_user?.id === 55) {
        items.push({
            label: (
                <a target="_blank" rel="noopener noreferrer" onClick={goToRegisters}>
                    <div style={{ display: 'flex', flexDirection: 'row', width: 250, justifyContent: 'flex-start', gap: 20 }}>
                        <ChecklistRtlIcon />
                        <h1>Ver registros</h1>
                    </div>
                </a>
            ),
        })
    }
    items.push({
        label: (
            <a target="_blank" rel="noopener noreferrer" onClick={salir}>
                <div style={{ display: 'flex', flexDirection: 'row', width: 250, justifyContent: 'flex-start', gap: 20 }}>
                    <LogoutIcon />
                    <h1>Salir</h1>
                </div>
            </a>
        ),
    })


    useEffect(() => {
        getData()
    }, [information_user?.id, open])

    const getData = async () => {
        try {
            setLoading(false)
            let response = await get_evaluated_participants({ company_id: information_user?.company?.id, evaluator_user_id: information_user?.id, mode: true })
            setData(response?.data)
            setRubric(response?.rubric)
        } catch (error) {
            console.log('error: ', error);
        } finally {
            setLoading(true)
        }
    }

    const [filterA, setFilterA] = useState(1)

    const filterData = (data, filterA,) => {
        let filterArray = [];
        if (filterA === 1) {
            filterArray = data.filter(item => item?.responses === null && !item?.ended_at)
        }
        if (filterA === 2) {
            filterArray = data.filter(item => item?.responses !== null && !item?.ended_at)
        }
        if (filterA === 3) {
            filterArray = data.filter(item => item?.ended_at)
        }

        return {
            data: filterArray,
            length: filterArray.length,
        }

    }

    const memoizedValue = useMemo(() =>
        filterData(data, filterA)
        , [data, filterA]);


    const handleTeamClick = ({ item }) => {
        try {
            if (item?.ended_at) {
                openNotificationWithIcon('warning')
                return;
            }
            let scheduled = rubric.find(i => item?.scheduled_evaluation_id === i?.id)
            //console.log('scheduled: ', scheduled);
            onToggleModal()
            setItem({ ...item, scheduled: scheduled })
        } catch (error) {
            console.log('error handleTeamClick: ', error);
        }
    };


    /*{
        "id": 3,
        "company": {
            "id": 1,
            "name": "TRUEMED GROUP",
            "color": "#389fa8"
        },
        "code": "259",
        "first_name": "EDITH",
        "last_name": "VAZQUEZ RANGEL",
        "section": {
            "id": 2,
            "name": "ADMINISTRACIÓN"
        },
        "role": {
            "id": 3,
            "name": "GERENTE ADMINISTRATIVO"
        },
        "phone": null,
        "created_at": "2023-11-21T21:02:20.894Z"
    }
}*/
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type) => {
        api[type]({
            message: 'Evaluación finalizada',
            description:
                'Esta evaluación ya ha sido contestada y finalizada. Gracias por tus comentarios',
        });
    };

    return (
        loading ?
            <div>
                {contextHolder}
                <Header className='bg-white' style={{ padding: 0, flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 0.5, paddingLeft: 20, paddingRight: 20 }}>
                    <h1>{`${information_user?.first_name} ${information_user?.last_name}`}</h1>
                    <Dropdown menu={{ items }} >
                        {/*   items: [
                            {
                                label: (
                                    <a onClick={() => window.close()}>
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <MoreHorizIcon />
                                            <h1>Salir</h1>
                                        </div>
                                    </a>
                                ),
                            }
                        ]
                    }}>*/}
                        <a onClick={(e) => e.preventDefault()} >
                            <div className="table-column-logo">
                                <MoreHorizIcon />
                            </div>
                        </a>
                    </Dropdown>
                </Header>
                <div
                    className="p-6 space-y-4"
                    style={{ overflowY: 'auto' }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            overflowX: 'auto',
                            height: 45
                        }}
                    >
                        {status.map((item) => (
                            <div
                                style={{
                                    minWidth: 120,
                                    borderWidth: 1,
                                    borderColor: '#B6B6B699',
                                    borderRadius: 50,
                                    justifyContent: 'space-evenly',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    padding: 6,
                                    marginRight: 6,
                                    alignItems: 'center',
                                    maxHeight: 35,
                                    background: item?.status === filterA && '#B6B6B699'
                                }}
                                onClick={() => setFilterA(item?.status)}
                            >
                                <h1>{item?.icon}</h1>
                                <h1
                                    style={{
                                        fontWeight: 600,
                                        borderColor: '#B6B6B6',
                                        fontSize: 12
                                    }}
                                >{item?.name}</h1>
                            </div>
                        )
                        )}
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                        {memoizedValue.data.map((item) => {
                            let scheduled = rubric.find(i => item?.scheduled_evaluation_id === i?.id)
                            return (
                                <CourseCard
                                    item={item}
                                    key={item.id}
                                    id={item.id}
                                    title={`${item?.evaluated_user?.first_name} ${item?.evaluated_user?.last_name}`}
                                    scheduled={scheduled}
                                    chaptersLength={2}
                                    isMe={information_user?.id === item?.evaluated_user?.id}
                                    category={item?.behavior_role?.name}
                                    onPress={(item) => handleTeamClick({ item })}
                                />
                            )
                        })}
                    </div>
                    {memoizedValue.length === 0 && <Emptiness />}
                </div>
                <Modal
                    open={open}
                    onClose={onToggleModal}
                >
                    <Box sx={{ ...styleModal }}>
                        <ModalForm
                            item={item}
                            self_evaluation={information_user?.id === item?.evaluated_user?.id}
                            onClose={onToggleModal}
                        />
                    </Box>
                </Modal>

                <Modal
                    open={openProfile}
                    onClose={onToggleModalProfile}
                >
                    <Box sx={{ ...style }}>
                        <ModalProfile
                            onClose={onToggleModalProfile}
                        />
                    </Box>
                </Modal>
            </div>
            : <Loading />
    )
}

export default Dashboards
