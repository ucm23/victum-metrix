
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
import ListIcon from '@mui/icons-material/List';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import GradingIcon from '@mui/icons-material/Grading';

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti';

import { notification, message } from 'antd';
import { index_scheduled_evaluations } from '../api/main/main';
import Emptiness from './Emptiness';
import Headers from './Headers';

const { Header, Content } = Layout;

function TabLabel(props) {
    const { label, icon, } = props;

    return (
        <Tab _selected={{ color: 'black', bg: '#B6B6B650', borderRadius: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'row', width: 100, justifyContent: 'flex-start', gap: 10 }}>
                {icon ? <PlaylistAddCheckIcon /> : <GradingIcon />}
                <h1>{label}</h1>
            </div>
        </Tab>
    );
}


function ModalResponses({ item, onClose, user }) {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    let behaviors = ''
    let sum = 0;

    const [one, setOne] = useState([])
    const [two, setTwo] = useState({})
    const [three, setThree] = useState({})


    useEffect(() => {
        if (!item?.status.includes("Pendiente")) getData();
    }, [])

    const getData = async () => {
        try {
            let response = await index_scheduled_evaluations({ id: item?.scheduled_evaluation_id, behavior_role_id: item?.behavior_role?.id, self_evaluation: true })
            setData(response?.data)
            await getMedia(response?.data?.competencies)
        } catch (error) {
            console.log('error: ', error);
        } finally {
            setLoading(true)
        }
    }

    const buscarBehaviorPorId = (competencies, behaviorId) => {
        for (const competencia of competencies || []) {
            const behaviorEncontrado = competencia?.behaviors.find(behavior => behavior.id === behaviorId);
            if (behaviorEncontrado) return competencia?.name
        }
        return null;
    };

    const buscarBehaviorPorId_ = (behaviorId) => {
        for (const competencia of data?.competencies || []) {
            const behaviorEncontrado = competencia?.behaviors.find(behavior => behavior.id === behaviorId);
            if (behaviorEncontrado) return {
                tipo: competencia?.name,
                name: behaviorEncontrado?.evaluation
            }
        }
        return null;
    };

    const getMedia = (competencies) => {
        //let aux = []
        let labels = []
        let labels_ = []
        let medias = {}
        item.responses.map((i_) => {
            const behaviorEncontrado = buscarBehaviorPorId(competencies, i_?.id);
            labels_.push(behaviorEncontrado)

            if (behaviors === behaviorEncontrado) {
                sum += i_?.response
                labels.push(behaviorEncontrado)
                medias[behaviorEncontrado] = { sum }
            } else sum = i_?.response
            behaviors = behaviorEncontrado
        })
        const aux = [...new Set(labels)];
        const frecuenciaElementos = labels_.reduce((acc, el) => {
            acc[el] = (acc[el] || 0) + 1;
            return acc;
        }, {});
        setThree(frecuenciaElementos)
        setOne(aux)
        setTwo(medias)
    }

    return (
        <div>
            <Tabs isLazy orientation="vertical" variant='unstyled'>
                <div style={{ padding: 10, paddingTop: 40 }}>
                    <TabList>
                        <TabLabel
                            label={'Promedio'}
                            icon={true}
                        />
                        <TabLabel
                            label={'Detalles'}
                        />
                    </TabList>
                </div>
                <div style={{ width: 0.5, backgroundColor: '#B6B6B699', height: 600 }} />
                <div style={{ paddingTop: 25, width: '100%', paddingBottom: 25, }}>
                    <TabPanels>
                        <TabPanel>
                            <div style={{ overflowX: 'auto', height: 550 }}>
                                {user &&
                                    <Headers
                                        name1={`${user?.first_name} ${user?.last_name}`}
                                        name2={`${item?.evaluator_user?.first_name} ${item?.evaluator_user?.last_name}`}
                                        code={user?.code}
                                        status={item?.status}
                                    />
                                }
                                <div style={{ marginTop: 25 }}>
                                    {(item?.status.includes("Terminado") && item.responses.length > 0 && loading) ?
                                        <div style={{ /*display: 'flex', flexWrap: 'wrap', flexDirection: 'row'*/ }}>
                                            <div style={{ display: 'flex', flexDirection: 'row', background: '#B6B6B699', borderColor: '#B6B6B6', borderWidth: 1.5, padding: 4 }}>
                                                <strong style={{ width: '55%', }}>
                                                    <h1>Comportamiento</h1>
                                                </strong>
                                                <strong style={{ width: '15%', textAlign: 'center', }}>
                                                    <h1>Total</h1>
                                                </strong>
                                                <strong style={{ width: '15%', textAlign: 'center', }}>
                                                    <h1>Cantidad</h1>
                                                </strong>
                                                <strong style={{ width: '15%', textAlign: 'center', }}>
                                                    <h1>Promedio</h1>
                                                </strong>
                                            </div>
                                            {one.map((item_) => {
                                                return (
                                                    <div style={{ display: 'flex', flexDirection: 'row', borderBottomWidth: 0.8, }}>
                                                        <h1 style={{ width: '55%', borderLeftWidth: 0.5, padding: 4 }}>
                                                            {item_}
                                                        </h1>
                                                        <h1 style={{ width: '15%', padding: 4, borderLeftWidth: 0.5, borderRightWidth: 0.5, textAlign: 'center', }}>
                                                            {two[item_]?.sum}
                                                        </h1>
                                                        <h1 style={{ width: '15%', borderRightWidth: 0.5, padding: 4, textAlign: 'center', }}>
                                                            {three[item_]}
                                                        </h1>
                                                        <h1 style={{ width: '15%', borderRightWidth: 0.5, padding: 4, textAlign: 'center', }}>
                                                            {(two[item_]?.sum / three[item_]).toFixed(2)}
                                                        </h1>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        : <Emptiness />}
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div style={{ height: 550 }}>
                                {user &&
                                    <Headers
                                        name1={`${user?.first_name} ${user?.last_name}`}
                                        name2={`${item?.evaluator_user?.first_name} ${item?.evaluator_user?.last_name}`}
                                        code={user?.code}
                                        status={item?.status}
                                    />
                                    /*<>
                                        <Typography variant="h4">
                                            {user?.first_name} {user?.last_name} ({user?.code})
                                        </Typography>
                                        <Typography variant="overline" gutterBottom style={{ textTransform: 'capitalize' }}>
                                            {item?.status}
                                        </Typography>
                                        <br />
                                        <Typography variant="button" gutterBottom style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                                            Evaluador: {item?.evaluator_user?.first_name} {item?.evaluator_user?.last_name}
                                        </Typography>
                                        {(user?.first_name === item?.evaluator_user?.first_name && user?.last_name === item?.evaluator_user?.last_name) &&
                                            <Typography variant="button" gutterBottom style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                                                &nbsp;(AUTOEVALUACIÓN)
                                            </Typography>
                                        }
                                    </>*/
                                }
                                <div style={{ marginTop: 25, }}>
                                    {(!item?.status.includes("Pendiente") && item.responses.length > 0 && loading) ?
                                        <div style={{ /*display: 'flex', flexWrap: 'wrap', flexDirection: 'row'*/ height: 380, }}>
                                            <div style={{ display: 'flex', flexDirection: 'row', background: '#B6B6B699', borderColor: '#B6B6B6', borderWidth: 1.5, padding: 4 }}>
                                                <strong style={{ width: '25%', }}>
                                                    <h1>Comportamiento</h1>
                                                </strong>
                                                <strong style={{ width: '65%', }}>
                                                    <h1>Competencia</h1>
                                                </strong>
                                                <strong style={{ width: '10%', textAlign: 'center' }}>
                                                    <h1>Puntos</h1>
                                                </strong>
                                            </div>
                                            <div style={{ overflowX: 'auto', height: 380 }}>
                                                {item.responses.map((i_, index) => {
                                                    const behaviorEncontrado = buscarBehaviorPorId_(i_?.id);
                                                    return (
                                                        <div style={{ display: 'flex', flexDirection: 'row', borderBottomWidth: 0.8, }}>
                                                            <h1 style={{ width: '25%', borderLeftWidth: 0.5, padding: 4, }}>
                                                                {behaviorEncontrado?.tipo}
                                                            </h1>
                                                            <h1 style={{ width: '65%', padding: 4, borderLeftWidth: 0.5, borderRightWidth: 0.5 }}>
                                                                {behaviorEncontrado?.name}
                                                            </h1>
                                                            <h1 style={{ width: '10%', borderRightWidth: 0.5, padding: 4, textAlign: 'center', }}>
                                                                {i_?.response}
                                                            </h1>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        : <Emptiness />}
                                </div>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </div>
            </Tabs>
        </div >
    )
}

export default ModalResponses
