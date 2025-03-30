"use client";
// pages/index.js
import {useState, useEffect} from 'react';
import Head from 'next/head';

export default function Home() {
    const [palabra, setPalabra] = useState('');
    const [intentos, setIntentos] = useState([]);
    const [intentoActual, setIntentoActual] = useState('');
    const [estadoJuego, setEstadoJuego] = useState('jugando'); // 'jugando', 'ganado', 'perdido'
    const [mensaje, setMensaje] = useState('');
    const MAX_INTENTOS = 6;

    // Lista de palabras para el juego
    const palabras = [
        'ACTOR', 'BAILE', 'CARRO', 'DISCO', 'ELITE',
        'FLORA', 'GENTE', 'IGUAL', 'JAQUE', 'LLAVE',
        'MUNDO', 'NUEVO', 'OASIS', 'PAPEL', 'QUESO',
        'RITMO', 'SALTO', 'TIGRE', 'UNION', 'VOLAR'
    ];

    useEffect(() => {
        // Seleccionar una palabra aleatoria al cargar
        const palabraAleatoria = palabras[Math.floor(Math.random() * palabras.length)];
        setPalabra(palabraAleatoria);
    }, []);

    const manejarTecla = (tecla) => {
        if (estadoJuego !== 'jugando') return;

        if (tecla === 'ENTER') {
            verificarIntento();
        } else if (tecla === 'BORRAR') {
            setIntentoActual(prev => prev.slice(0, -1));
        } else if (/^[A-Z]$/.test(tecla) && intentoActual.length < 5) {
            setIntentoActual(prev => prev + tecla);
        }
    };

    const verificarIntento = () => {
        // Verificar que el intento sea de 5 letras
        if (intentoActual.length !== 5) {
            setMensaje('La palabra debe tener 5 letras');
            return;
        }

        // Verificar si la palabra existe en nuestra lista
        if (!palabras.includes(intentoActual)) {
            setMensaje('La palabra no está en la lista');
            return;
        }

        const nuevoIntento = [];
        const palabraArray = palabra.split('');

        // Verificar letras correctas en posición correcta
        for (let i = 0; i < 5; i++) {
            if (intentoActual[i] === palabraArray[i]) {
                nuevoIntento.push({letra: intentoActual[i], estado: 'correcto'});
            } else if (palabraArray.includes(intentoActual[i])) {
                nuevoIntento.push({letra: intentoActual[i], estado: 'presente'});
            } else {
                nuevoIntento.push({letra: intentoActual[i], estado: 'ausente'});
            }
        }

        const nuevosIntentos = [...intentos, nuevoIntento];
        setIntentos(nuevosIntentos);
        setIntentoActual('');
        setMensaje('');

        // Verificar si el jugador ganó
        if (intentoActual === palabra) {
            setEstadoJuego('ganado');
            setMensaje('¡Felicidades, has ganado!');
        } else if (nuevosIntentos.length >= MAX_INTENTOS) {
            // Verificar si el jugador perdió
            setEstadoJuego('perdido');
            setMensaje(`¡Perdiste! La palabra era: ${palabra}`);
        }
    };

    const reiniciarJuego = () => {
        const palabraAleatoria = palabras[Math.floor(Math.random() * palabras.length)];
        setPalabra(palabraAleatoria);
        setIntentos([]);
        setIntentoActual('');
        setEstadoJuego('jugando');
        setMensaje('');
    };

    // Teclado virtual
    const teclado = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BORRAR']
    ];

    // Determinar el estado de cada tecla
    const obtenerEstadoTecla = (tecla) => {
        let estado = '';

        for (let i = 0; i < intentos.length; i++) {
            for (let j = 0; j < intentos[i].length; j++) {
                if (intentos[i][j].letra === tecla) {
                    const nuevoEstado = intentos[i][j].estado;

                    if (nuevoEstado === 'correcto') {
                        return 'correcto';
                    } else if (nuevoEstado === 'presente' && estado !== 'correcto') {
                        estado = 'presente';
                    } else if (nuevoEstado === 'ausente' && estado === '') {
                        estado = 'ausente';
                    }
                }
            }
        }

        return estado;
    };

    // Efecto para escuchar eventos de teclado
    useEffect(() => {
        const manejarTecladoFisico = (event) => {
            const tecla = event.key.toUpperCase();

            if (tecla === 'ENTER') {
                manejarTecla('ENTER');
            } else if (tecla === 'BACKSPACE') {
                manejarTecla('BORRAR');
            } else if (/^[A-ZÑ]$/.test(tecla)) {
                manejarTecla(tecla);
            }
        };

        window.addEventListener('keydown', manejarTecladoFisico);

        return () => {
            window.removeEventListener('keydown', manejarTecladoFisico);
        };
    }, [intentoActual, estadoJuego]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
            <Head>
                <title>Wordle - Juego de palabras</title>
                <meta name="description" content="Una versión de Wordle en Next.js"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <h1 className="text-4xl font-bold mb-4">Wordle</h1>

            {mensaje && (
                <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">
                    {mensaje}
                </div>
            )}

            <div className="mb-6">
                {/* Tablero de juego */}
                <div className="grid grid-rows-6 gap-2">
                    {/* Renderizar intentos realizados */}
                    {Array.from({length: MAX_INTENTOS}).map((_, rowIndex) => (
                        <div key={rowIndex} className="grid grid-cols-5 gap-2">
                            {rowIndex < intentos.length
                                ? intentos[rowIndex].map((item, colIndex) => (
                                    <div
                                        key={colIndex}
                                        className={`
                        w-14 h-14 flex items-center justify-center text-2xl font-bold border-2 
                        ${
                                            item.estado === 'correcto'
                                                ? 'bg-green-500 text-white border-green-600'
                                                : item.estado === 'presente'
                                                    ? 'bg-yellow-500 text-white border-yellow-600'
                                                    : 'bg-gray-500 text-white border-gray-600'
                                        }
                      `}
                                    >
                                        {item.letra}
                                    </div>
                                ))
                                : rowIndex === intentos.length
                                    ? // Intento actual
                                    Array.from({length: 5}).map((_, colIndex) => (
                                        <div
                                            key={colIndex}
                                            className={`
                        w-14 h-14 flex items-center justify-center text-2xl font-bold 
                        border-2 border-gray-300
                        ${colIndex < intentoActual.length ? 'border-gray-500' : ''}
                      `}
                                        >
                                            {colIndex < intentoActual.length ? intentoActual[colIndex] : ''}
                                        </div>
                                    ))
                                    : // Filas vacías
                                    Array.from({length: 5}).map((_, colIndex) => (
                                        <div
                                            key={colIndex}
                                            className="w-14 h-14 flex items-center justify-center text-2xl font-bold border-2 border-gray-200"
                                        ></div>
                                    ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Teclado virtual */}
            <div className="w-full max-w-xl">
                {teclado.map((fila, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center mb-2">
                        {fila.map((tecla) => {
                            const estadoTecla = obtenerEstadoTecla(tecla);
                            let clases = 'mx-1 py-3 rounded font-bold';

                            if (tecla === 'ENTER' || tecla === 'BORRAR') {
                                clases += ' px-2 text-xs';
                            } else {
                                clases += ' w-10';
                            }

                            if (estadoTecla === 'correcto') {
                                clases += ' bg-green-500 text-white';
                            } else if (estadoTecla === 'presente') {
                                clases += ' bg-yellow-500 text-white';
                            } else if (estadoTecla === 'ausente') {
                                clases += ' bg-gray-500 text-white';
                            } else {
                                clases += ' bg-gray-300';
                            }

                            return (
                                <button
                                    key={tecla}
                                    className={clases}
                                    onClick={() => manejarTecla(tecla)}
                                    disabled={estadoJuego !== 'jugando'}
                                >
                                    {tecla}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            {estadoJuego !== 'jugando' && (
                <button
                    onClick={reiniciarJuego}
                    className="mt-6 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Jugar de nuevo
                </button>
            )}
        </div>
    );
}