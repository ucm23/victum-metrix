
import React, { useEffect, useState, useMemo, useContext, useRef } from 'react';
import { useParams } from "react-router-dom"
import { v5 as uuidv5 } from 'uuid';
import { Button, notification, Space, Spin, Flex } from 'antd';

import { NavLink, useNavigate } from "react-router-dom";

import { connect, useDispatch, useStore, } from "react-redux";

import {
    useBreakpointValue,
} from '@chakra-ui/react';
import Context from '../../main/Context';
import { login } from '../../api/auth/auth';
import { get_company } from '../../api/main/main';

import Loading from '../../components/Loading'

const datas = {
    "11116e73-1c03-5de6-9130-5f9925ae8ab4": {
        "name": 'Evaluación 360'
    },
    "087ebe8-1ef8-5d97-8873-735b4949004d": {
        "name": 'Evaluación 1000'
    }
}

const mensajes = {
    'error': {
        title: "Advertencia",
        description: "Parece que ha habido un problema al intentar iniciar sesión. Por favor, verifica tu correo electrónico y contraseña e intenta nuevamente."
    },
    'warning': {
        title: "Contraseña incorrecta",
        description: "Lo siento, la contraseña ingresada no es válida. Asegúrate de escribir la contraseña correcta y vuelve a intentarlo."
    },
    'success': {
        title: "Has iniciado sesión",
        description: "Has iniciado sesión correctamente en la aplicación. Bienvenido de nuevo"
    }
};


function Login({ openSession }) {

    const { id_company, email } = useParams();

    const navigate = useNavigate();
    const { signIn } = useContext(Context);

    const mobile = useBreakpointValue({ base: true, md: false });

    const form = useRef();

    const [data, setData] = useState({
        email: email,
        password: '',
        code: ''
    });

    /*
        email: 'eziocano23@hotmail.com',
        password: 'd63f9cfd',
    */

    const [load, setLoad] = useState(false);
    const [company, setCompany] = useState(null);

    const handleChange = (event) => {
        const { value, name } = event.currentTarget;
        setData({ ...data, [name]: value });
    }

    const handleLogin = async () => {

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.email.trim() || !data.password.trim()) {
            openNotificationWithIcon('error')
            return;
        }

        if (!regexEmail.test(data.email)) {
            openNotificationWithIcon('warning')
            return;
        }

        const response = await login({ ...data });
        if (response?.status === 2) {
            openNotificationWithIcon('success')
            ejecutar();
            openSession('OPEN_', response?.data)
        } else {
            openNotificationWithIcon('error')
            return;
        }
    };

    function esperarSegundos() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 1501);
        });
    }

    async function ejecutar() {
        await esperarSegundos();
        navigate(`/`);
        signIn()
    }

    useEffect(() => {
        getImg(id_company)
    }, [id_company])

    const getImg = async (id_company) => {
        try {
            /*fetch(id_company)
                .then(response => {
                    if (response.status === 200) setLoad(true)
                });*/
            let response = await get_company({ id: id_company })
            //console.log('response: ', response);
            setCompany(response?.data)
            setLoad(true)
        } catch (error) {
            console.log('error: ', error);
        }
    }

    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type) => {
        api[type]({
            message: mensajes[type].title,
            description: mensajes[type].description,
        });
    };

    if (!id_company) {
        return (
            <div className={`flex flex-1 ${!mobile && "min-h-full"}`} style={{ flexDirection: mobile ? 'column-reverse' : 'row', justifyContent: 'space-between' }} >
                <div className="grid min-h-full place-items-center bg-white px-10 py-10 sm:py-32 lg:px-10">
                    <div className="">
                        <p className="text-base font-semibold text-indigo-600">Algo anda mal...</p>
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Página sin elementos</h1>
                        <p className="mt-6 text-base leading-7 text-gray-600">Al parecer este formulario ya no encuenta activo</p>
                        <div className="mt-10 flex gap-x-6">
                            <a
                                href="#"
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Contactar soporte <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </div>
                </div>
                <img
                    className=""
                    src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1908&amp;q=80"
                    alt={""}
                    style={
                        mobile ? { width: '100%', height: 75, objectFit: 'cover' } :
                            { width: '50%', objectFit: 'cover' }
                    }
                />
            </div>
        )
    } else {
        if (load) {
            return (
                <div className="flex min-h-full flex-1" style={{ flexDirection: 'row-reverse' }} >
                    {contextHolder}
                    {!mobile &&
                        <img
                            className=""
                            src={'/assets/bg.jpeg'}
                            alt={""}
                            style={{ width: '50%', objectFit: 'cover' }}
                        />
                    }
                    <div className="flex min-h-full flex-1 flex-col">
                        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                            <img
                                className="mx-auto h-10 w-auto"
                                src={`/assets/${company?.name}.png`}
                                alt=""
                                style={{
                                    objectFit: 'scale-down',
                                    //width: 300
                                    height: 100
                                }}
                            />
                            <h2 className="mt-3 text-center text-2xl font-bold leading-9 tracking-tight" style={{ textTransform: 'capitalize', color: company?.color }}>
                                {company?.name}
                            </h2>
                            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            Correo electrónico
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="email"
                                                name="email"
                                                type="text"
                                                autoComplete="text"
                                                required
                                                value={data.email}
                                                onChange={handleChange}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                                Contraseña
                                            </label>
                                        </div>
                                        <div className="mt-2">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                autoComplete="current-password"
                                                required
                                                value={data.password ?? ''}
                                                onChange={handleChange}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            onClick={handleLogin}
                                            style={{
                                                backgroundColor: company?.color
                                            }}
                                            className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Ingresar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h1
                            style={{
                                fontSize: 13,
                                fontStyle: 'italic',
                                color: 'gray',
                                textAlign: 'center'
                            }}
                        >
                            © Todos los derechos reservados, Grupo CTI Tech-IN POS 2023
                        </h1>
                    </div>
                </div>
            )
        } else {
            return <Loading />
        }

    }

}

//export default Login


const mapStateToProps = state => ({ session: state.login.session });

const mapDispatchToProps = dispatch => ({
    openSession(type, data) { dispatch({ type, data }) }
});


export default connect(mapStateToProps, mapDispatchToProps)(Login);