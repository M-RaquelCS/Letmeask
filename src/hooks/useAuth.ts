// criação da hook para simplificar o uso da autenticação do usuário
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'

export function useAuth(){
  const value =  useContext(AuthContext)

  return value;
}