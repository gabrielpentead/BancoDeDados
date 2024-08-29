import { useState, useEffect } from 'react';
import { db, auth } from './firebaseConnection';

import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [post, setPost] = useState([]);

  useEffect(() => {
    async function carregarPost() {
      const dados = onSnapshot(collection(db, "posts"), (Snapshot) => {
        let listaPost = [];

        Snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          });
        });
        setPost(listaPost);
      });
    }
    carregarPost(); 
  }, []);

  // C - Create
  async function adicionarPost() {
    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    }).then(() => {
      alert("Cadastro realizado com sucesso!");
      setAutor('');
      setTitulo('');
    }).catch((error) => {
      console.log(error);
    });
  }

  // R - Read
  async function buscarPosts() {
    const config = collection(db, "posts");
    await getDocs(config).then((Snapshot) => {
      let lista = [];

      Snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor
        });
      });

      setPost(lista);

    }).catch((error) => {
      console.log(error);
    });
  }

  // U - Update
  async function editarPost() {
    const postEditado = doc(db, "posts", idPost); 

    await updateDoc(postEditado, {
      titulo: titulo,
      autor: autor
    }).then(() => {
      alert("Post editado com sucesso!");
      setIdPost(''); 
      setTitulo('');
      setAutor('');
    }).catch((error) => {
      console.log(error);
    });
  }

  // D - Delete
  async function excluirPost(id) {
    try {
      const postDeletado = doc(db, "posts", id);
      await deleteDoc(postDeletado);
      alert("Post deletado com sucesso");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1>ReactJS + Firebase</h1>

      <h2>POST</h2>
      <label>ID do Post</label>
      <input
        placeholder="ID do Post"
        value={idPost}
        onChange={(e) => setIdPost(e.target.value)}
      />

      <label>Título:</label>
      <textarea
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <label>Autor:</label>
      <input
        type="text"
        placeholder="Autor do Post"
        value={autor}
        onChange={(e) => setAutor(e.target.value)}
      />

      <button onClick={adicionarPost}>Insert</button>
      <button onClick={buscarPosts}>Buscar</button>
      <button onClick={editarPost}>Editar</button>

      <ul>
        {post.map((value) => (
          <li key={value.id}>
            <strong>ID: {value.id}</strong>
            <span>Título: {value.titulo}</span>
            <span>Autor: {value.autor}</span>
            <button onClick={() => excluirPost(value.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
