import Link from "next/link"

export default function Inicio() {
    return (
        <div>
            <h1>Bem-vindo</h1>
            <Link href='/game'>Iniciar o Ogoj</Link>
        </div>
    )
}