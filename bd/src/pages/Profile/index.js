import { useContext, useState } from 'react'; 
import { FiUpload } from 'react-icons/fi';
import avatar from '../../assets/avatar.png';
import { AuthContext } from '../../contexts/auth';
import { db, storage } from '../../services/firebaseConnection';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'; // Importando o Link
import './profile.css';

export default function Profile() {
  const { user, storageUser, setUser, logout } = useContext(AuthContext);

  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imageAvatar, setImageAvatar] = useState(null);
  const [nome, setNome] = useState(user && user.nome);
  const [email, setEmail] = useState(user && user.email);

  function handleFile(e) {
    if (e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === 'image/jpeg' || image.type === 'image/png') {
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      } else {
        toast.error('Envie uma imagem do tipo PNG ou JPEG');
        setImageAvatar(null);
        return;
      }
    }
  }

  async function handleUpload() {
    const currentUid = user.uid;
    const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`);

    try {
      const uploadTask = await uploadBytes(uploadRef, imageAvatar);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      await updateDoc(doc(db, "users", user.uid), {
        avatarUrl: downloadURL,
        nome: nome,
      });

      const updatedUser = { ...user, nome: nome, avatarUrl: downloadURL };
      setUser(updatedUser);
      storageUser(updatedUser);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error('Erro ao atualizar o perfil. Tente novamente mais tarde.');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (imageAvatar === null && nome !== '') {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          nome: nome,
        });

        const updatedUser = { ...user, nome: nome };
        setUser(updatedUser);
        storageUser(updatedUser);
        toast.success('Nome atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar o nome:', error);
        toast.error('Erro ao atualizar o perfil. Tente novamente mais tarde.');
      }
    } else if (nome !== '' && imageAvatar !== null) {
      handleUpload();
    }
  }

  return (
    <div>
      <div className="content">
        <div className="container">
          <form className="form-profile" onSubmit={handleSubmit}>
            <label className="label-avatar">
              <span>
                <FiUpload color="#FFF" size={25} />
              </span>

              <input type="file" accept="image/*" onChange={handleFile} /> <br />
              {avatarUrl === null ? (
                <img src={avatar} alt="Foto de perfil" width={250} height={250} />
              ) : (
                <img src={avatarUrl} alt="Foto de perfil" width={250} height={250} />
              )}
            </label>

            <label>Nome</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

            <label>Email</label>
            <input type="text" value={email} disabled={true} />

            <button type="submit">Salvar</button>
          </form>
        </div>

        <div className="container">
          <Link to="/minhas-vendas">
            <button className="minhas-vendas-btn">Gerenciar Vendas</button>
          </Link>
          <button className="logout-btn" onClick={() => logout()}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
