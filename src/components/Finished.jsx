
import { Layout, } from 'antd';
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti';
import { Result } from 'antd';

const { Content } = Layout;

const Finished = ({ color_primary, goBack }) => {
   const { width, height } = useWindowSize();
   return (
      <Content style={{ backgroundColor: 'white', }}>
         <Confetti
            width={width}
            height={height}
            colors={
               ['#b6b6b6', '#1677ff', color_primary]
            }
            numberOfPieces={100}
            recycle={false}
         />
         <div
            style={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               height: '100%'
            }}
         >
            <Result
               status="success"
               title="Sus respuestas han sido registradas correctamente"
               subTitle="Gracias por su tiempo"
               extra={[
                  <button
                     onClick={goBack}
                     type="button"
                     style={{ backgroundColor: color_primary }}
                     class="inline-flex items-center px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                     Finalizar
                  </button>
               ]}
            />
            {/*<center>
              <img
                  style={{
                      objectFit: 'scale-down',
                      width: 50,
                  }}
                  src={"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Check_green_circle.svg/2048px-Check_green_circle.svg.png"}
                  alt=""
              />
              <strong>
                  <h1>
                      Sus respuestas han sido registradas correctamente
                  </h1>
              </strong>
              <h1>
                  Gracias por su tiempo
              </h1>
              <div class="flex items-center" style={{ marginBottom: 20, marginTop: 10, justifyContent: 'center' }}>
                  <span class="sm:ml-3">
                      <button onClick={goBack} type="button" class="bg-primary-100 inline-flex items-center px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                          Finalizar
                      </button>
                  </span>
              </div>
          </center>*/}
         </div>
      </Content>
   )
}

export default Finished;
