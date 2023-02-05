import axios from 'axios';
import React, { useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UsersContext';
import { useNavigate } from 'react-router-dom';
export const Register = () => {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const { setToken } = useContext(AuthContext);
  const { setUser } = useContext(UserContext);
  const handleSubmit = (evt) => {
    evt.preventDefault();
    axios
      .post('http://localhost:5000/user/register', {
        user_name: firstNameRef.current.value,
        phone: lastNameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
      .then((data) => {
        if (data.status === 201) {
          setToken(data.data.token);
          setUser(data.data.user);
          navigate('/');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='w-50 mx-auto p-5 my-5 shadow'>
      <h2 className='h1  text-center my-5'>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          ref={firstNameRef}
          type='text'
          placeholder='user_name'
          className='form-control mb-3'
        />
        <input
          ref={lastNameRef}
          type='tel'
          placeholder='phone'
          className='form-control mb-3'
        />
        <input
          ref={emailRef}
          type='email'
          placeholder='Email'
          className='form-control mb-3'
        />
        <input
          ref={passwordRef}
          type='password'
          placeholder='Password'
          className='form-control mb-3'
        />
        <button
          type='submit'
          className='btn btn-primary'
        >
          SEND
        </button>
      </form>
    </div>
  );
};
