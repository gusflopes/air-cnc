import React, { useState } from 'react';
import api from '../../services/api';


export default function Login({ history }) {

   const [email, setEmail] = useState('');

   async function handleSubmit(event) {
     // Evita o reload da pagina
     event.preventDefault();
 
     /* É assim, mas como email = email, só coloco EMAIL || api.post('/sessions', { email: email }) */
     const response = await api.post('/sessions', { email })
 
     const { _id } = response.data;
 
     localStorage.setItem('user', _id);

     history.push('/dashboard');
   }

   return (
      <>
      <p>Ofereça <strong>spots</strong> para programadores e encontre <strong>talentos</strong> para sua empresa.</p>

      <form onSubmit={handleSubmit}>
         <label htmlFor="email">E-MAIL *</label>
         <input
            id="email"
            placeholder="Seu melhor e-mail"
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
         />
         <button type="submit" className="btn">Entrar</button>
      </form>
      </>
   )
}
