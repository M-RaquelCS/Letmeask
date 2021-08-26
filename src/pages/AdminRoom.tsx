// sala do administrador, aberta ao criar a sala
import { useHistory, useParams } from 'react-router-dom';

//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import {RoomCode} from '../components/RoomCode';
import {Question} from '../components/Question';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom(){
  //const {user} = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  
  const roomId = params.id;
  const {questions, title} = useRoom(roomId);
  // função para encerrar sala ao terminar de usar
  async function handleRemoveRoom(){
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(), //será adicionado nos dados da sala a data e a hora do encerramento da mesma, a sala que tiver essa data nos dados não irá abrir mais
    })
    history.push('/');
  }
  // função de deletar a perguntar pelo id gerado pelo banco de dados
  async function handleDeleteQuestion(questionId: string){
    if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }
  // função de dar um check na pergnta, ou seja finalizar a mesma
  async function handleCheckQuestionAsAnswer(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered:true,
    });
  }
  //função de destacar a mesma para informar ao usuário que aquela pergunta está sendo respondida  
  async function handleHighlightQuestion(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted:true,
    });
  }

  return(
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="logo letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleRemoveRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map(question =>{
            return(
              <Question
                key={question.id} 
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button type="button" onClick={()=> handleCheckQuestionAsAnswer(question.id)}>
                      <img src={checkImg} alt="marcar a question como respondida" />
                    </button>
                    <button type="button" onClick={()=> handleHighlightQuestion(question.id)}>
                      <img src={answerImg} alt="dar destaque a pergunta question" />
                    </button>
                  </>
                )}
                <button type="button" onClick={()=> handleDeleteQuestion(question.id)}>
                  <img src={deleteImg} alt="delete question" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  );
}

// algoritmo de reconcilhação