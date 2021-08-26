// criação da sala
import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom'

import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

import illuminationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

//import { useAuth } from '../hooks/useAuth'; useAuth();

import { Button } from '../components/Button';

import '../styles/auth.scss';

export function NewRoom(){
  const { user } = useAuth()
  const history = useHistory()
  const [newRoom, setNewRoom] = useState('');
  // função que rodará ao cliclar no botão 'criar sala'
  async function handleCreateRoom(event: FormEvent){
    event.preventDefault();
    // verificação de que o nome da sala está preenchido se não, nao criara a sala 
    if(newRoom.trim()===''){
      return;
    }
    // mandando a sala criada junto ao seu nome, id do criador e id da sala que foi criada naquele instante
    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    })
    // redirecionamento para a sala criada na visão do administrador
    history.push(`/admin/rooms/${firebaseRoom.key}`)
  }

  return(
    <div id='page-auth'>
      <aside>
        <img src={illuminationImg} alt="ilustração da pagina home - perguntas e respostas" />
        <strong>Toda pergunta tem uma resposta.</strong>
        <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
      </aside>
      <main>
        <div className='main-content'>
          <img src={logoImg} alt="logo de letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              type="text" 
              placeholder="Nome da sala" 
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>Quer entrar em uma sala já existente? <Link to="/">clique aqui</Link></p>
        </div>
      </main>
    </div>
  );
}