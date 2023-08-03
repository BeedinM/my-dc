//difinir tamanho do mapa
const TAMANHO_MAPA = 30;

//gerar um número inteiro aleatório entre um número máximo e mínimo definidos
const inteiroAleatorio = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

//criar mapa vazio, preenche o mapa com paredes de acordo com o tamanho do mapa definido
const gerarMapaVazio = () => {
    const mapa = [];
    for (let i = 0; i < TAMANHO_MAPA; i++){
        const linha = new Array(TAMANHO_MAPA).fill('#');
        mapa.push(linha);
    }
    return mapa;
};

//criar uma sala com tamanho aleatório baseado em um max/min
const criarSala = (mapa, x, y, width, height) => {
    for (let i = y; i < y + height; i++) {
        for (let j = x; j < x + width; j++) {
            mapa[i][j] = '.';
        }
    }
};

//receber sala aleatória dentre as existentes
const salaAleatoria = (salas) => {
    return salas[inteiroAleatorio(0, salas.length - 1)];
};

//criar corredores aleatórios 
const criarCorredor = (mapa, x1, y1, x2, y2) => {
    let x = x1;
    let y = y1;

    while (x !== x2) {
        x += x < x2 ? 1 : -1;
        mapa[y][x] = '.';
    }

    while (y !== y2) {
        y += y < y2 ? 1 : -1;
        mapa[y][x] = '.';
    }
};

const gerarMapaAleatorio = () => {
    const dungeon = gerarMapaVazio();
    const salas = [];

    //gerar as salas
    for (let i = 0; i < 5; i++) {
        const salaWidth = inteiroAleatorio(4, 8);
        const salaHeight = inteiroAleatorio(4, 8);
        const salaX = inteiroAleatorio(1, TAMANHO_MAPA - salaWidth - 1);
        const salaY = inteiroAleatorio(1, TAMANHO_MAPA - salaHeight -1);
        criarSala(dungeon, salaX, salaY, salaWidth, salaHeight);
        salas.push({ x: salaX, y: salaY, width: salaWidth, height: salaHeight });
    }

    //gerar os corredores ligados as salas
    const salasConectadas = [salas[0]]
    for (let i = 1; i < salas.length; i++) {
        const prevSala = salaAleatoria(salasConectadas);
        const sala = salas[i];
        criarCorredor(dungeon, prevSala.x + Math.floor(prevSala.width / 2), prevSala.y + Math.floor(prevSala.height / 2), sala.x + Math.floor(sala.width / 2), sala.y + Math.floor(sala.height / 2));
        salasConectadas.push(sala);
    }

    return dungeon;
};

const teste = gerarMapaAleatorio();

console.log(teste);

