import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal } from '../../components/Modal/Modal';
import { UserContext } from '../../context/UsersContext';

export const Posts = () => {
  const [postModal, setPostModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [dataset, setDataset] = useState('');

  const [posts, setPosts] = useState([]);

  const newTitle = useRef();
  const newBody = useRef();

  const { user } = useContext(UserContext);

  const titleRef = useRef();
  const bodyRef = useRef();

  const editClick = () => {
    setEditModal(true);
  };

  const getPost = async () => {
    const data = await axios.get('http://localhost:5000/todo', {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    });
    setPosts(data.data);
  };

  useEffect(() => {
    getPost();
  }, []);

  const hanlePost = (evt) => {
    evt.preventDefault();

    fetch('http://localhost:5000/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({
        text: titleRef.current.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setPostModal(false);
          getPost();
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    const findedPost = posts.filter((post) => {
      if (post.id === id) {
        axios
          .delete(`http://localhost:5000/todo/${post.id}`, {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          })
          .catch((err) => console.log(err));
        getPost();
      }

      setEditModal(false);
    });
  };

  const handleEdit = (evt) => {
    evt.preventDefault();

    const findedPost = posts.find((post) => {
      if (post.id === dataset) {
        axios
          .put(
            `http://localhost:5000/todo/${post.id}`,
            {
              text: newTitle.current.value,
              author: user.first_name + ' ' + user.last_name,
            },
            {
              headers: {
                Authorization: localStorage.getItem('token'),
              },
            }
          )
          .catch((err) => console.log(err));
      }

      getPost();
      setEditModal(false);
    });

    posts.title = newTitle.current.value;
    posts.body = newBody.current.value;
  };

  return (
    <div>
      <button
        className='btn btn-outline-success '
        onClick={() => setPostModal(true)}
      >
        ADD TODO +
      </button>
      <h2 className='h2 text-center my-5'>TODO...</h2>
      {posts.length ? (
        <ul className='list-unstyled justify-content-center row flex-column '>
          {posts.map((el) => (
            <li
              className='mt-2 align-items-center col-4 border p-3 rounded  mx-auto d-flex'
              key={el.id}
            >
              <p className='m-0'>{el.todo_value}</p>
              <button
                onClick={() => {
                  editClick();
                  setDataset(el.id);
                }}
                className='btn btn-warning ms-auto'
              >
                EDIT
              </button>
              <button
                className='btn btn-danger ms-2'
                onClick={() => handleDelete(el.id)}
              >
                DELETE
              </button>
            </li>
          ))}
        </ul>
      ) : (
        ''
      )}
      {postModal ? (
        <Modal
          modal={postModal}
          setModal={setPostModal}
        >
          <form onSubmit={hanlePost}>
            <input
              className='form-control mb-3'
              ref={titleRef}
              type='text'
              placeholder='TODO...'
            />
            <button className='btn btn-success '>Send</button>
          </form>
        </Modal>
      ) : (
        ''
      )}

      {editModal ? (
        <Modal
          modal={editModal}
          setModal={setEditModal}
          title='Edit Post'
        >
          <form onSubmit={handleEdit}>
            <input
              className='form-control'
              ref={newTitle}
              type='text'
              placeholder='Edit TODO'
            />
            <button className='btn btn-success'>SEND</button>
          </form>
        </Modal>
      ) : (
        ''
      )}
    </div>
  );
};
