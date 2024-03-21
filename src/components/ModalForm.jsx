
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import {
    useBreakpointValue,
} from '@chakra-ui/react'

import { useState, useEffect } from 'react'
import { Layout, } from 'antd';
import Alert from '@mui/material/Alert';

import CloseIcon from '@mui/icons-material/Close';

import { useStore, useDispatch } from "react-redux";
import { colorPrimary } from '../theme';
import { Divider } from '@chakra-ui/react'

import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme, backgroundColor }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: backgroundColor,
    },
}));

import { index_scheduled_evaluations, send_response } from '../api/main/main';
import Finished from './Finished';

const { Content } = Layout;

function ModalForm({ item, self_evaluation, onClose }) {

    const store = useStore();

    const { information_user } = store.getState().login;
    let color_primary = information_user?.company?.color

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const [showIntro, setShowIntro] = useState(false)
    const [showFinished, setShowFinished] = useState(false)

    const [current, setCurrent] = useState(0);
    const [quizzAnswers, setQuizzAnswers] = useState([]);

    const mobile = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        try {
            let response = await index_scheduled_evaluations({ id: item?.scheduled_evaluation_id, behavior_role_id: item?.behavior_role?.id, self_evaluation })
            setData(response?.data)
        } catch (error) {
            console.log('error: ', error);
        } finally {
            setLoading(true)
        }
    }

    const goBack = () => onClose(false)
    const next = () => setCurrent(current + 1);
    const prev = () => setCurrent(current - 1);
    const [showError, setShowError] = useState(false)
    const done = async () => {
        let fecth = await send_response({ id: item?.id, responses: responses })
        if (fecth.status) {
            setShowFinished(true)
        } else {
            onClose(false)
            setShowError(true)
        }
    }

    const [responses, setResponses] = useState([]);

    const handleRadioChange = (id, value) => {
        const newResponse = {
            "id": id,
            "response": value
        };
        setResponses([...responses, newResponse]);
    };

    return (
        <div className="transition-enter">
            {!showFinished ?
                <Content style={{ backgroundColor: 'white', }}>
                    {showIntro ?
                        <div className="flex min-h-full flex-1" style={{ flexDirection: 'row' }} >
                            {!mobile &&
                                <div style={{ width: '45%', }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: 10,
                                        bottom: 10,
                                        left: 10,
                                        flexDirection: 'column',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                    >
                                        <img
                                            className=""
                                            src={`./assets/PROEX.png`}
                                            alt={data?.competencies[current]?.name}
                                            style={{
                                                height: 75,
                                                objectFit: 'scale-down',
                                                filter: 'drop-shadow(0px 0px 4px white)',
                                            }}
                                        />
                                        <img
                                            className=""
                                            src={`./assets/logo-360.png`}
                                            alt={data?.competencies[current]?.name}
                                            style={{
                                                height: 75,
                                                objectFit: 'scale-down',
                                                filter: 'drop-shadow(0px 0px 4px white)',
                                            }}
                                        />
                                    </div>
                                    <img
                                        className=""
                                        src={`./assets/${data?.competencies[current]?.name}.jpg`}
                                        alt={data?.competencies[current]?.name}
                                        style={{ height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            }
                            <div
                                style={{
                                    justifyContent: 'space-between',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: mobile ? 6 : 20
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <div
                                        style={{
                                            width: '95%'
                                        }}
                                    >
                                        <BorderLinearProgress variant="determinate" color="primary" sx={{ backgroundColor: colorPrimary }} value={((current + 1) / (data?.competencies.length)) * 100} />
                                        <h1
                                            style={{
                                                fontSize: 13
                                            }}
                                        >
                                            Sección {current + 1}/{data?.competencies.length}
                                        </h1>
                                    </div>
                                    <div onClick={() => onClose(false)}>
                                        <CloseIcon />
                                    </div>
                                </div>

                                <div
                                    style={{
                                        overflowY: 'auto'
                                    }}
                                >
                                    <center>
                                        <img
                                            style={{
                                                objectFit: 'scale-down',
                                                width: 175,
                                            }}
                                            src={`/assets/${information_user?.company?.name}.png`}
                                            alt=""
                                        />
                                        <h1 style={{
                                            color: color_primary,
                                        }}>
                                            {data?.evaluation?.name}
                                        </h1>
                                        <h1 style={{
                                            fontSize: 16,
                                            marginBottom: 6
                                        }}>
                                            {data?.competencies[current]?.name}
                                        </h1>
                                    </center>
                                    <strong>
                                        <h1> Con respecto a: <span style={{ color: color_primary }}> {item?.evaluated_user?.first_name} {item?.evaluated_user?.last_name} </span></h1>
                                    </strong>
                                    <h1
                                        style={{
                                            fontSize: 13
                                        }}
                                    >
                                        {data?.competencies[current]?.description}
                                    </h1>

                                    <table style={{ width: '100%' }} className="table-rubric">
                                        <tr>
                                            <td></td>
                                            <th>Nunca</th>
                                            <th>Casi nunca</th>
                                            <th>En cierta medida</th>
                                            <th>Casi siempre</th>
                                            <th>Siempre</th>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <th>1</th>
                                            <th>2</th>
                                            <th>3</th>
                                            <th>4</th>
                                            <th>5</th>
                                        </tr>
                                        {data?.competencies[current]?.behaviors.map((item_comp, index) => {
                                            ///let find_response = item.responses.find(i => i?.id === item_comp?.id)
                                            return (
                                                <tr key={`behaviors-${index}-${item_comp?.id}`}>
                                                    <th style={{ width: '50%', textAlign: 'justify' }}>{index + 1}. {item_comp?.evaluation}</th>
                                                    {[1, 2, 3, 4, 5].map((item_) => (
                                                        <th>
                                                            <input type="radio" /*checked={find_response?.response === item_}*/ required id="huey" name={index + 1} value={item_} onChange={() => handleRadioChange(item_comp?.id, item_)} />
                                                        </th>
                                                    ))}
                                                </tr>
                                            )
                                        })}
                                        {/*data?.competencies[current]?.behaviors.map((item_comp, index) => {
                                            let find_response = item.responses.find(i => i?.id === item_comp?.id);
                                            const radioGroupName = `radioGroup-${index}`;

                                            return (
                                                <tr key={`behaviors-${index}-${item_comp?.id}`}>
                                                    <th style={{ width: '50%', textAlign: 'justify' }}>{item_comp?.evaluation}</th>
                                                    {[1, 2, 3, 4, 5].map((item_) => (
                                                        <th key={`radio-${index}-${item_}`}>
                                                            <input
                                                                type="radio"
                                                                //checked={find_response?.response === item_}
                                                                id={`radio-${index}-${item_}`}
                                                                name={radioGroupName}
                                                                value={item_}
                                                                onChange={() => handleRadioChange(item_comp?.id, item_)}
                                                            />
                                                        </th>
                                                    ))}
                                                </tr>
                                            );
                                        })*/}
                                    </table>
                                </div>
                                <div>
                                    {showError &&
                                        <Alert severity="error" onClose={() => setShowError(false)}>Parece que ha habido un problema al intentar guardar las respuestas. Por favor, intenta nuevamente.</Alert>
                                    }
                                    <Divider style={{ marginTop: 4 }} />
                                    <div class="flex items-center" style={{ marginBottom: 20, marginTop: 10, justifyContent: 'flex-end' }}>
                                        {current > 0 && (
                                            <button onClick={prev} type="button" class="inline-flex items-center bg-gray px-3 py-2 text-sm font-semibold text-gray-900">
                                                Anterior
                                            </button>
                                        )}

                                        {current < data?.competencies.length - 1 && (
                                            <span class="sm:ml-3">
                                                <button onClick={next} type="button" style={{ backgroundColor: color_primary }} class="inline-flex items-center px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                                    Siguiente
                                                </button>
                                            </span>
                                        )}

                                        {current === data?.competencies.length - 1 && quizzAnswers[current] !== 0 && (
                                            <span class="sm:ml-3">
                                                <button onClick={done} type="button" style={{ backgroundColor: color_primary }} class="inline-flex items-center px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                                    <svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                                    </svg>
                                                    Terminar
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        : <div className="flex min-h-full flex-1" style={{ flexDirection: 'row' }} >
                            <div
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    //flexDirection: 'column',
                                    padding: mobile ? 0 : 20,
                                    backgroundColor: '#B6B6B650',
                                    justifyItems: 'center',
                                    overflowY: 'auto',
                                }}
                            >
                                <div
                                    style={{
                                        padding: 15,
                                        backgroundColor: 'white',
                                        width: mobile ? '100%' : '60%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-around'
                                    }}
                                >
                                    <div>
                                        <center>
                                            <img
                                                style={{
                                                    objectFit: 'scale-down',
                                                    width: 160,
                                                }}
                                                src={`/assets/${information_user?.company?.name}.png`}
                                                alt=""
                                            />
                                        </center>
                                        <strong>
                                            <h1 style={{
                                                fontSize: 16,
                                                textAlign: 'center'
                                            }}>
                                                {item?.scheduled?.evaluation?.name}
                                            </h1>
                                        </strong>
                                    </div>
                                    <h1>
                                        A continuación, encontrarás unos comportamientos que evalúan las competencias de <strong>Liderazgo 360° TRUEMED</strong>, {self_evaluation ? "para que realices una auto evaluación de tu desempeño en esta competencia." : "para que elijas la opción que más se aproxime a lo que tú has observado de la persona a quien vas a retroalimentar."}
                                    </h1>
                                    <h1>
                                        Es importante que consideres, dentro de lo posible, su comportamiento a lo largo del tiempo que llevas en la empresa y no solamente lo más reciente.
                                    </h1>
                                    <h1>
                                        No hay respuestas correctas o incorrectas. Lo más importante es que expreses tu opinión desde una percepción objetiva y cierta, <strong>siempre con el enfoque de generar valor  y crecimiento a tu desarrollo personal y profesional.</strong>
                                    </h1>
                                    <h1>
                                        Cada comportamiento puede ser evaluado con cinco criterios de observación. Por favor, marca aquella que más se acerque a tu percepción. Ninguna afirmación debe quedar sin respuesta.
                                    </h1>
                                    <div>
                                        <h1>
                                            Tus respuestas son totalmente confidenciales.
                                        </h1>

                                        <table class="styled-table" style={{ width: '100%' }}>
                                            <tr>
                                                <th style={{ backgroundColor: color_primary }}>Nombre</th>
                                            </tr>
                                            <tr>
                                                <td>{item?.evaluated_user?.first_name} {item?.evaluated_user?.last_name}</td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div>
                                        <h1>
                                            Escala para responder:
                                        </h1>
                                        <table class="styled-table" style={{ width: '100%' }}>
                                            <tr style={{ backgroundColor: color_primary }}>
                                                <th>1</th>
                                                <th>2</th>
                                                <th>3</th>
                                                <th>4</th>
                                                <th>5</th>
                                            </tr>
                                            <tr>
                                                <td rowspan="2">Nunca</td>
                                                <td rowspan="2">Casi nunca</td>
                                                <td>En cierta medida</td>
                                                <td rowspan="2">Casi siempre</td>
                                                <td rowspan="2">Siempre</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    A veces
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>No se observa</td>
                                                <td>Aprendiendo</td>
                                                <td>Aplicando</td>
                                                <td colspan="2">Modelando</td>
                                            </tr>
                                        </table>
                                        {item?.scheduled?.notes &&
                                            <h1><strong>NOTAS: </strong><span>{item?.scheduled?.notes}</span></h1>
                                        }
                                    </div>
                                    <div class="flex items-center" style={{ marginBottom: 20, marginTop: 10, justifyContent: 'center' }}>
                                        <span class="sm:ml-3">
                                            <button onClick={() => setShowIntro(!showIntro)} type="button" style={{ backgroundColor: color_primary }} class="inline-flex items-center px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                                Comenzar
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </Content> :
                <Finished
                    color_primary={color_primary}
                    goBack={goBack}
                />
            }
        </div>
    )
}

export default ModalForm
