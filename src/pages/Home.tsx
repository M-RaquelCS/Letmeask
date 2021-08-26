// criação da página inicial do site
import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom'

import { database } from '../services/firebase';

import { useAuth } from '../hooks/useAuth';

import illuminationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';

import '../styles/auth.scss';

export function Home(){

  const history = useHistory();
  const { user ,signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');
  // função de criar a sala
  async function handleCreateRoom(){
    if(!user){ // verificar se existe um usuário, se não existe ele ira abrir  popup de login
      await signInWithGoogle()
    }

    history.push('/rooms/new'); // ao criar a sala ele será redirecionado para a página da visão do administrador
  }
  // função de entrar em uma sala já criada
  async function handleJoinRoom(event: FormEvent){
    event.preventDefault();
    // verificar se o código digitado não é vazio
    if(roomCode.trim() === ''){
      return;
    }
    // se o código for o certo comparando ao banco de dados ele entrará na sala na visão do telespectador
  
    const roomRef = await database.ref(`rooms/${roomCode}`).get();
    // verificar se o código digitado é válido, se o código estiver errado ou se a sala já foi encerrada cairá nessas condições
    if(!roomRef.exists()){
      alert('Room doesn`t exists.');
      return;
    }
    if(roomRef.val().endedAt){
      alert('Room already closed.')
      return;
    }

    history.push(`/rooms/${roomCode}`) // redirecionamento para a sala na visão do telespectador
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
          <button className='create-room' onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="icon do google" />
            Crie sua sala com o Google
          </button>
          <div className='separator'>ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text" 
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}